param([string]$Preset = "aqua")

$presets = @{
    aqua   = [ordered]@{
        "--bg" = "#0d1a21"; "--surface" = "#15252e"; "--fg" = "#eef4f4"
        "--muted" = "#94a8b3"; "--accent" = "#4fd8d0"; "--accent-2" = "#c4a7ff"
        "--accent-fg" = "#06201f"
    }
    lagoon = [ordered]@{
        "--bg" = "#0e1a1c"; "--surface" = "#162629"; "--fg" = "#f1f3ec"
        "--muted" = "#98a7a3"; "--accent" = "#58d3c0"; "--accent-2" = "#f2c768"
        "--accent-fg" = "#06201b"
    }
    sky    = [ordered]@{
        "--bg" = "#0e1a24"; "--surface" = "#162634"; "--fg" = "#eef3f8"
        "--muted" = "#93a6b8"; "--accent" = "#5cbcff"; "--accent-2" = "#ff9ec2"
        "--accent-fg" = "#04182a"
    }
}

if (-not $presets.ContainsKey($Preset)) {
    Write-Host "Preset nahi mila: $Preset (aqua, lagoon ya sky likho)"
    exit 1
}

$vars = $presets[$Preset]
$utf8 = New-Object System.Text.UTF8Encoding $false
$css = Join-Path (Get-Location) "app/globals.css"
$t = [System.IO.File]::ReadAllText($css)

foreach ($k in $vars.Keys) {
    $pattern = "(?m)^(\s*)" + [regex]::Escape($k) + ":\s*[^;]+;"
    $t = [regex]::Replace($t, $pattern, ("`$1" + $k + ": " + $vars[$k] + ";"))
}

$extra = @'
/* theme extras */
body {
  background:
    radial-gradient(900px 520px at 85% -5%, color-mix(in srgb, var(--accent) 9%, transparent), transparent 60%),
    radial-gradient(700px 520px at -5% 35%, color-mix(in srgb, var(--accent-2) 6%, transparent), transparent 60%),
    var(--bg);
}

/* solid accent buttons par gradient */
.bg-accent {
  background-image: linear-gradient(90deg, var(--accent), var(--accent-2));
}
'@

$rx = New-Object System.Text.RegularExpressions.Regex('/\* (mint )?theme extras \*/.*?\.bg-accent \{[^}]*\}', [System.Text.RegularExpressions.RegexOptions]::Singleline)
if ($rx.IsMatch($t)) {
    $ev = [System.Text.RegularExpressions.MatchEvaluator] { param($m) $extra.TrimEnd() }
    $t = $rx.Replace($t, $ev, 1)
}
else {
    $t = $t + "`r`n`r`n" + $extra
}

[System.IO.File]::WriteAllText($css, $t, $utf8)

Write-Host "Preset: $Preset"
Select-String -Path $css -Pattern '^\s*--(bg|surface|fg|muted|accent|accent-2|accent-fg):' | ForEach-Object { $_.Line.Trim() }
Write-Host "DONE."