#Requires -RunAsAdministrator
<#
  Opens inbound TCP 3000 on Windows Defender Firewall so other PCs on the LAN can reach `next dev` / `next start`.

  Run once on the machine that hosts the dev server:
    powershell -ExecutionPolicy Bypass -File scripts/open-windows-dev-server-firewall.ps1

  If you use a different port, pass it:
    powershell -ExecutionPolicy Bypass -File scripts/open-windows-dev-server-firewall.ps1 -Port 3001
#>
param(
  [int] $Port = 3000
)

$ruleName = "Node.js Next.js dev server TCP $Port"
$existing = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
if ($existing) {
  Write-Host "Rule already exists: $ruleName"
  exit 0
}

New-NetFirewallRule -DisplayName $ruleName -Direction Inbound -Action Allow -Protocol TCP -LocalPort $Port -Profile Private, Domain | Out-Null
Write-Host "Created firewall rule: $ruleName (Private and Domain profiles)"
