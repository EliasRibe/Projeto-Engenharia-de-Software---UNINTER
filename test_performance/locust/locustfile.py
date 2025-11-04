from locust import HttpUser, task, between
import random, datetime, json

class SGHSSUser(HttpUser):
    wait_time = between(0.2, 1.0)
    token = None

    def on_start(self):
        # login (pega token)
        with self.client.post("/auth/login", json={"email":"paciente@vida.plus","password":"123456"}, catch_response=True) as r:
            if r.status_code == 200:
                self.token = r.json().get("token")

    @task(3)
    def criar_agendamento(self):
        if not self.token: return
        date = (datetime.datetime.utcnow() + datetime.timedelta(minutes=random.randint(1,60))).isoformat()
        headers = {"Authorization": f"Bearer {self.token}"}
        payload = {"patientId": "p1", "date": date, "type": "Presencial"}
        self.client.post("/appointments", headers=headers, json=payload, name="/appointments")

    @task(1)
    def consultar_records(self):
        if not self.token: return
        headers = {"Authorization": f"Bearer {self.token}"}
        self.client.put("/records/r1", headers=headers, json={"diagnostico":"ok","observacoes":"perf"}, name="/records:update")
        