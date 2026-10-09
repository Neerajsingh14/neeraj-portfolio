param([string]$Preset = "indigo")

$presets = @{
    indigo = [ordered]@{
        "--bg" = "#0d0f1a"; "--surface" = "#151828"; "--fg" = "#eef0fa"
        "--muted" = "#9aa0bd"; "--accent" = "#8b9bff"; "--accent-2" = "#ff8fb1"
        "--accent-fg" = "#0b0d1c"
    }
    amber  = [ordered]@{
        "--bg" = "#14110d"; "--surface" = "#1d1914"; "--fg" = "#f7f0e6"
        "--muted" = "#a79d8f"; "--accent" = "#f6c453"; "--accent-2" = "#ff8a5c"
        "--accent-fg" = "#1a1303"
    }
    ocean  = [ordered]@{
        "--bg" = "#0b1623"; "--surface" = "#122133"; "--fg" = "#eaf3fb"
        "--muted" = "#8fa3b8"; "--accent" = "#60c4ff"; "--accent-2" = "#a78bfa"
        "--accent-fg" = "#06121f"
    }
}

if (-not $presets.ContainsKey($Preset)) {
    Write-Host "Preset nahi mila: $Preset  (indigo, amber ya ocean likho)"
    exit 1
}

$vars = $presets[$Preset]
$utf8 = New-Object System.Text.UTF8Encoding $false

# ---------- 1) colors (sirf :root ke 7 variables) ----------
$css = Join-Path (Get-Location) "app/globals.css"
$t = [System.IO.File]::ReadAllText($css)

foreach ($k in $vars.Keys) {
    $pattern = "(?m)^(\s*)" + [regex]::Escape($k) + ":\s*[^;]+;"
    $t = [regex]::Replace($t, $pattern, ("`$1" + $k + ": " + $vars[$k] + ";"))
}

# ---------- 2) purana extras block hatao, naya (colors se judne wala) lagao ----------
$t = [regex]::Replace($t, '(?s)\r?\n*/\* (mint )?theme extras \*/.*$', '')

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
$t = $t + $extra
[System.IO.File]::WriteAllText($css, $t, $utf8)
Write-Host "patched: app/globals.css"

# ---------- 3) hardcoded glow ko accent color se jodo ----------
$glow22 = 'shadow-[0_0_22px_color-mix(in_srgb,var(--accent)_40%,transparent)]'
$glow18 = 'shadow-[0_0_18px_color-mix(in_srgb,var(--accent)_40%,transparent)]'

$f1 = Join-Path (Get-Location) "components/FloatingActions.tsx"
$a = [System.IO.File]::ReadAllText($f1)
$a = [regex]::Replace($a, 'shadow-\[0_0_22px_rgba\([^)]*\)\]', $glow22)
[System.IO.File]::WriteAllText($f1, $a, $utf8)
Write-Host "patched: components/FloatingActions.tsx"

$f2 = Join-Path (Get-Location) "components/Education.tsx"
$b = [System.IO.File]::ReadAllText($f2)
$b = [regex]::Replace($b, 'shadow-\[0_0_18px_rgba\([^)]*\)\]', $glow18)
[System.IO.File]::WriteAllText($f2, $b, $utf8)
Write-Host "patched: components/Education.tsx"

Write-Host ""
Write-Host "Preset: $Preset"
Select-String -Path $css -Pattern '^\s*--(bg|surface|fg|muted|accent|accent-2|accent-fg):' | ForEach-Object { $_.Line.Trim() }
Write-Host ""
Write-Host "DONE."