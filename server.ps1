param(
    [int]$Port = 8000
)

$port = $Port

function Send-CorsOptions($response) {
    try {
        $response.StatusCode = 204
        $response.Headers["Access-Control-Allow-Origin"] = "*"
        $response.Headers["Access-Control-Allow-Methods"] = "GET, POST, PATCH, DELETE, OPTIONS"
        $response.Headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        $response.ContentLength64 = 0
        $response.Close()
    } catch {}
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
try {
    $listener.Start()
    Write-Host "AIMEX 2026 Backend & Web Server running at http://localhost:$port/"
} catch {
    $port = 8080
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Start()
    Write-Host "AIMEX 2026 Backend & Web Server running at http://localhost:$port/"
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
}

$CONFIG = @{
    college = "MITS Deemed to be University (MITS)"
    dept    = "Department of Artificial Intelligence and Machine Learning"
    fest    = "AIMEX 2026"
    upiId   = "deptfest@upi"
    payee   = "AIMEX 2026 Dept Fest"
    festDate= "2026-11-05T09:00:00"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $method = $request.HttpMethod
        $rawUrl = $request.Url.LocalPath
        $path = $rawUrl.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($path)) {
            $path = "index.html"
        }

        # Handle CORS Preflight
        if ($method -eq "OPTIONS") {
            Send-CorsOptions $response
            continue
        }

        # Read JSON body if present
        $bodyText = ""
        $bodyJson = $null
        if ($request.HasEntityBody) {
            $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
            $bodyText = $reader.ReadToEnd()
            $reader.Close()
            if (-not [string]::IsNullOrWhiteSpace($bodyText)) {
                try { $bodyJson = $bodyText | ConvertFrom-Json } catch {}
            }
        }

        # ---- REST API ROUTES ----
        if ($rawUrl.StartsWith("/api/")) {
            
            # GET /api/config
            if ($rawUrl -eq "/api/config" -and $method -eq "GET") {
                Send-Json $response 200 $CONFIG
                continue
            }

            # GET /api/events
            if ($rawUrl -eq "/api/events" -and $method -eq "GET") {
                $evs = Get-EventsData
                Send-Json $response 200 $evs
                continue
            }

            # POST /api/registration-status
            if ($rawUrl -eq "/api/registration-status" -and $method -eq "POST") {
                $studentName = if ($bodyJson.name) { ([string]$bodyJson.name -replace '\s+', ' ').Trim() } else { "" }
                $roll = if ($bodyJson.roll) { ([string]$bodyJson.roll).Trim().ToUpperInvariant() } else { "" }
                $eventId = if ($bodyJson.eventId) { ([string]$bodyJson.eventId).Trim() } else { "" }
                if ([string]::IsNullOrWhiteSpace($studentName) -or [string]::IsNullOrWhiteSpace($roll) -or [string]::IsNullOrWhiteSpace($eventId) -or $studentName.Length -gt 120 -or $roll.Length -gt 64) {
                    Send-Json $response 400 @{ error = "Student name, roll number, and event are required." }
                    continue
                }

                $evs = Get-EventsData
                $targetEv = $evs | Where-Object { $_.id -eq $eventId } | Select-Object -First 1
                if ($null -eq $targetEv) {
                    Send-Json $response 400 @{ error = "Select a valid fest event." }
                    continue
                }

                try {
                    $allRegs = @(Get-RegistrationsData)
                    $rollPattern = "(?i)(?<![A-Z0-9])$([regex]::Escape($roll))(?![A-Z0-9])"
                    $matched = $null
                    foreach ($registration in $allRegs) {
                        if ($registration.eventId -ne $eventId) { continue }

                        $registeredName = ([string]$registration.name -replace '\s+', ' ').Trim()
                        $registeredRoll = ([string]$registration.roll).Trim().ToUpperInvariant()
                        if ($registeredRoll -eq $roll -and $registeredName -eq $studentName) {
                            $matched = $registration
                            break
                        }

                        foreach ($member in ([string]$registration.members -split '\r?\n')) {
                            if ($member -match $rollPattern) {
                                $memberName = ($member -replace [regex]::Escape($roll), '' -replace '[()\[\]{}]', ' ' -replace '\s+', ' ').Trim([char[]]@(' ', '(', ')', '-', ':', ','))
                                if ($memberName -eq $studentName) {
                                    $matched = $registration
                                    break
                                }
                            }
                        }
                        if ($null -ne $matched) { break }
                    }

                    $status = if ($null -ne $matched -and $matched.status) { [string]$matched.status } elseif ($null -ne $matched) { "Payment Pending" } else { $null }
                    Send-Json $response 200 @{ registered = ($null -ne $matched); status = $status }
                } catch {
                    Write-Warning "Could not check student registration: $($_.Exception.Message)"
                    Send-Json $response 500 @{ error = "Registration records are unavailable right now." }
                }
                continue
            }

            # POST /api/register
            if ($rawUrl -eq "/api/register" -and $method -eq "POST") {
                if ($null -eq $bodyJson -or [string]::IsNullOrWhiteSpace($bodyJson.eventId) -or [string]::IsNullOrWhiteSpace($bodyJson.name)) {
                    Send-Json $response 400 @{ error = "Missing required fields (eventId, name, email, roll)" }
                    continue
                }

                $evs = Get-EventsData
                $targetEv = $evs | Where-Object { $_.id -eq $bodyJson.eventId } | Select-Object -First 1
                if ($null -eq $targetEv) {
                    Send-Json $response 404 @{ error = "Event not found" }
                    continue
                }

                # Generate unique ID
                $chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
                $rnd = New-Object System.Random
                $code = -join (1..6 | ForEach-Object { $chars[$rnd.Next(0, $chars.Length)] })
                $regId = "AIMEX-$code"

                $newReg = [PSCustomObject]@{
                    id          = $regId
                    eventId     = $bodyJson.eventId
                    eventName   = $targetEv.name
                    name        = [string]$bodyJson.name.Trim()
                    email       = [string]$bodyJson.email.Trim()
                    phone       = [string]$bodyJson.phone.Trim()
                    roll        = [string]$bodyJson.roll.Trim().ToUpper()
                    dept        = [string]$bodyJson.dept
                    year        = [string]$bodyJson.year
                    size        = if ($bodyJson.size) { [string]$bodyJson.size } else { "1" }
                    members     = if ($bodyJson.members) { [string]$bodyJson.members } else { "" }
                    extraLabel  = if ($bodyJson.extraLabel) { [string]$bodyJson.extraLabel } else { "" }
                    extraValue  = if ($bodyJson.extraValue) { [string]$bodyJson.extraValue } else { "" }
                    fee         = [int]$targetEv.fee
                    utr         = ""
                    status      = "Payment Pending"
                    checkedIn   = $false
                    checkInTime = $null
                    timestamp   = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
                }

                # Update live slot count
                if ($targetEv.slotsLeft -gt 0) {
                    $targetEv.slotsLeft = [int]$targetEv.slotsLeft - 1
                    Save-EventsData $evs
                }

                $allRegs = @(Get-RegistrationsData)
                $allRegs = @($newReg) + $allRegs
                Save-RegistrationsData $allRegs

                Send-Json $response 201 @{
                    success      = $true
                    registration = $newReg
                    message      = "Registration created successfully"
                }
                continue
            }

            # POST /api/pay
            if ($rawUrl -eq "/api/pay" -and $method -eq "POST") {
                if ($null -eq $bodyJson -or [string]::IsNullOrWhiteSpace($bodyJson.id) -or [string]::IsNullOrWhiteSpace($bodyJson.utr)) {
                    Send-Json $response 400 @{ error = "Registration ID and UTR number are required" }
                    continue
                }

                $allRegs = @(Get-RegistrationsData)
                $found = $null
                for ($i = 0; $i -lt $allRegs.Count; $i++) {
                    if ($allRegs[$i].id -eq $bodyJson.id) {
                        $allRegs[$i].utr = [string]$bodyJson.utr.Trim()
                        $allRegs[$i].status = "Confirmed (Verified)"
                        $allRegs[$i] | Add-Member -NotePropertyName "paymentTime" -NotePropertyValue ((Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")) -Force
                        $found = $allRegs[$i]
                        break
                    }
                }

                if ($null -eq $found) {
                    Send-Json $response 404 @{ error = "Registration not found" }
                    continue
                }

                Save-RegistrationsData $allRegs
                Send-Json $response 200 @{
                    success      = $true
                    registration = $found
                    message      = "Payment verified and registration confirmed"
                }
                continue
            }

            # GET /api/tickets (query by id, roll, email)
            if ($rawUrl.StartsWith("/api/tickets") -and $method -eq "GET") {
                $allRegs = @(Get-RegistrationsData)
                $idQuery = $request.QueryString["id"]
                $rollQuery = $request.QueryString["roll"]
                $emailQuery = $request.QueryString["email"]

                if (-not [string]::IsNullOrWhiteSpace($idQuery)) {
                    $matched = $allRegs | Where-Object { $_.id -eq $idQuery.Trim() } | Select-Object -First 1
                    if ($null -eq $matched) {
                        Send-Json $response 404 @{ error = "Ticket not found" }
                    } else {
                        Send-Json $response 200 @{ success = $true; ticket = $matched }
                    }
                    continue
                }

                if (-not [string]::IsNullOrWhiteSpace($rollQuery)) {
                    $matched = @($allRegs | Where-Object { $_.roll -eq $rollQuery.Trim().ToUpper() })
                    Send-Json $response 200 @{ success = $true; tickets = $matched }
                    continue
                }

                if (-not [string]::IsNullOrWhiteSpace($emailQuery)) {
                    $matched = @($allRegs | Where-Object { $_.email -eq $emailQuery.Trim().ToLower() })
                    Send-Json $response 200 @{ success = $true; tickets = $matched }
                    continue
                }

                Send-Json $response 200 @{ success = $true; tickets = $allRegs }
                continue
            }

            # POST /api/tickets/checkin
            if ($rawUrl -eq "/api/tickets/checkin" -and $method -eq "POST") {
                if ($null -eq $bodyJson -or [string]::IsNullOrWhiteSpace($bodyJson.id)) {
                    Send-Json $response 400 @{ error = "Ticket ID is required" }
                    continue
                }

                $ticketId = $bodyJson.id.Trim().ToUpper()
                $allRegs = @(Get-RegistrationsData)
                $found = $null

                for ($i = 0; $i -lt $allRegs.Count; $i++) {
                    if ($allRegs[$i].id.ToUpper() -eq $ticketId) {
                        if ($allRegs[$i].checkedIn -eq $true) {
                            Send-Json $response 200 @{
                                success     = $true
                                alreadyIn   = $true
                                registration= $allRegs[$i]
                                message     = "Already checked in at $($allRegs[$i].checkInTime)"
                            }
                            $found = $allRegs[$i]
                            break
                        }
                        $allRegs[$i].checkedIn = $true
                        $allRegs[$i].checkInTime = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
                        $found = $allRegs[$i]
                        break
                    }
                }

                if ($null -eq $found) {
                    Send-Json $response 404 @{ error = "Ticket ID not found" }
                    continue
                }

                Save-RegistrationsData $allRegs
                Send-Json $response 200 @{
                    success     = $true
                    alreadyIn   = $false
                    registration= $found
                    message     = "Participant checked in successfully!"
                }
                continue
            }

            # GET /api/admin/registrations
            if ($rawUrl -eq "/api/admin/registrations" -and $method -eq "GET") {
                $allRegs = @(Get-RegistrationsData)
                $evFilter = $request.QueryString["eventId"]
                $search = $request.QueryString["search"]
                $statusFilter = $request.QueryString["status"]

                $result = $allRegs
                if (-not [string]::IsNullOrWhiteSpace($evFilter) -and $evFilter -ne "all") {
                    $result = @($result | Where-Object { $_.eventId -eq $evFilter })
                }
                if (-not [string]::IsNullOrWhiteSpace($statusFilter) -and $statusFilter -ne "all") {
                    $result = @($result | Where-Object { $_.status -like "*$statusFilter*" })
                }
                if (-not [string]::IsNullOrWhiteSpace($search)) {
                    $s = $search.Trim().ToLower()
                    $result = @($result | Where-Object {
                        $_.name.ToLower().Contains($s) -or
                        $_.roll.ToLower().Contains($s) -or
                        $_.email.ToLower().Contains($s) -or
                        $_.id.ToLower().Contains($s) -or
                        ($_.utr -and $_.utr.ToLower().Contains($s))
                    })
                }

                Send-Json $response 200 @{
                    success       = $true
                    count         = $result.Count
                    registrations = $result
                }
                continue
            }

            # GET /api/admin/stats
            if ($rawUrl -eq "/api/admin/stats" -and $method -eq "GET") {
                $allRegs = @(Get-RegistrationsData)
                $evs = Get-EventsData

                $total = $allRegs.Count
                $confirmed = @($allRegs | Where-Object { $_.status -like "*Confirmed*" })
                $checkedIn = @($allRegs | Where-Object { $_.checkedIn -eq $true }).Count
                $totalRevenue = 0
                foreach ($c in $confirmed) {
                    $totalRevenue += [int]$c.fee
                }

                $byEvent = @{}
                foreach ($e in $evs) {
                    $eRegs = @($allRegs | Where-Object { $_.eventId -eq $e.id })
                    $byEvent[$e.id] = @{
                        name      = $e.name
                        count     = $eRegs.Count
                        confirmed = @($eRegs | Where-Object { $_.status -like "*Confirmed*" }).Count
                        slotsLeft = $e.slotsLeft
                    }
                }

                Send-Json $response 200 @{
                    totalRegistrations = $total
                    confirmedCount     = $confirmed.Count
                    checkedInCount     = $checkedIn
                    totalRevenue       = $totalRevenue
                    byEvent            = $byEvent
                }
                continue
            }

            # GET /api/admin/export (CSV)
            if ($rawUrl -eq "/api/admin/export" -and $method -eq "GET") {
                $allRegs = @(Get-RegistrationsData)
                $sb = New-Object System.Text.StringBuilder
                [void]$sb.AppendLine('"Ticket ID","Event","Participant Name","Email","Phone","Roll Number","Department","Year","Team Size","Team Members","Fee (INR)","Status","UTR Reference","Checked In","Check-in Time","Registered At"')

                foreach ($r in $allRegs) {
                    $membersClean = ([string]$r.members).Replace('"', '""').Replace("`r`n", " | ").Replace("`n", " | ")
                    $line = '"{0}","{1}","{2}","{3}","{4}","{5}","{6}","{7}","{8}","{9}","{10}","{11}","{12}","{13}","{14}","{15}"' -f `
                        $r.id, `
                        $r.eventName, `
                        $r.name.Replace('"', '""'), `
                        $r.email, `
                        $r.phone, `
                        $r.roll, `
                        $r.dept, `
                        $r.year, `
                        $r.size, `
                        $membersClean, `
                        $r.fee, `
                        $r.status, `
                        $r.utr, `
                        (if ($r.checkedIn) { "Yes" } else { "No" }), `
                        $r.checkInTime, `
                        $r.timestamp
                    [void]$sb.AppendLine($line)
                }

                $csvBytes = [System.Text.Encoding]::UTF8.GetBytes($sb.ToString())
                $response.StatusCode = 200
                $response.ContentType = "text/csv; charset=utf-8"
                $response.Headers["Content-Disposition"] = 'attachment; filename="aimex-2026-registrations.csv"'
                $response.Headers["Access-Control-Allow-Origin"] = "*"
                $response.ContentLength64 = $csvBytes.Length
                $response.OutputStream.Write($csvBytes, 0, $csvBytes.Length)
                $response.Close()
                continue
            }

            # PATCH /api/admin/registrations
            if ($rawUrl.StartsWith("/api/admin/registrations/") -and $method -eq "PATCH") {
                $targetId = $rawUrl.Substring("/api/admin/registrations/".Length).Trim()
                $allRegs = @(Get-RegistrationsData)
                $found = $null
                for ($i = 0; $i -lt $allRegs.Count; $i++) {
                    if ($allRegs[$i].id -eq $targetId) {
                        if ($bodyJson.status) { $allRegs[$i].status = [string]$bodyJson.status }
                        if ($null -ne $bodyJson.checkedIn) { $allRegs[$i].checkedIn = [bool]$bodyJson.checkedIn }
                        $found = $allRegs[$i]
                        break
                    }
                }
                if ($null -eq $found) {
                    Send-Json $response 404 @{ error = "Registration not found" }
                } else {
                    Save-RegistrationsData $allRegs
                    Send-Json $response 200 @{ success = $true; registration = $found }
                }
                continue
            }

            Send-Json $response 404 @{ error = "API Endpoint Not Found" }
            continue
        }

        # ---- STATIC FILE SERVING ----
        $filePath = Join-Path $root $path

        if (Test-Path -Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = "application/octet-stream"
            if ($mimeTypes.ContainsKey($ext)) {
                $contentType = $mimeTypes[$ext]
            }

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.Headers["Access-Control-Allow-Origin"] = "*"
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentLength64 = $msg.Length
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.Close()
    } catch {
        # continue on transient socket error
    }
}
