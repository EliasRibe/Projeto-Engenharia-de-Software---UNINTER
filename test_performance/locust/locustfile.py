from locust import HttpUser, task, between

class SGHSSUser(HttpUser):
    # tempo aleatório entre requisições
    wait_time = between(1, 3)

    def on_start(self):
        """Executa uma vez ao iniciar: login simulado"""
        self.client.post("/auth/login", json={
            "email": "teste@vida.plus",
            "password": "Senha@123"
        })

    @task(3)
    def listar_prontuarios(self):
        """Consulta prontuários (requisição leve, frequente)"""
        self.client.get("/records?patientId=123", name="GET /records")

    @task(1)
    def agendar_consulta(self):
        """Cria agendamento (requisição mais pesada)"""
        self.client.post("/appointments", json={
            "patientId": 123,
            "doctorId": 45,
            "slot": "2025-10-24T14:30:00Z"
        }, name="POST /appointments")

