resource "aws_key_pair" "microservices-doxa-key" {
  key_name   = "microservices-doxa-key"
  public_key = file("./microservices_doxa.pem")
}
