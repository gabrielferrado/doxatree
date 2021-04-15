resource "aws_eip" "portfolio-service-eip" {
  instance = module.portfolio-service.instance-id
}

module "portfolio-service" {
  source = "./node-server"

  ami-id               = "ami-0c27c96aaa148ba6d"
  iam-instance-profile = module.portfolio-service-codedeploy.iam-instance-profile
  key-pair             = aws_key_pair.microservices-doxa-key.key_name
  name                 = "portfolio-service"
  private-ip           = "10.0.1.5"
  subnet-id            = aws_subnet.microservices-demo-subnet-private-1.id
  vpc-security-group-ids = [
    aws_security_group.allow-internal-http.id,
    aws_security_group.allow-ssh.id,
    aws_security_group.allow-all-outbound.id
  ]
}

module "portfolio-service-codedeploy" {
  source = "./codedeploy-app"

  app-name          = "portfolio-service"
  ec2-instance-name = module.portfolio-service.name
}
