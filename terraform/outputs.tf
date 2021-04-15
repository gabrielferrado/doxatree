
output "api-gateway-private-ip" {
  value = module.api-gateway.private-ip
}

output "api-gateway-public-ip" {
  value = aws_eip.api-gateway-eip.public_ip
}

output "portfolio-service-private-ip" {
  value = module.portfolio-service.private-ip
}
