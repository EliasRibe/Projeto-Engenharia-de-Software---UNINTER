// sghss.cy.js
const base = Cypress.config('baseUrl');

describe('SGHSS – Fluxos principais', () => {
  let token;
  let appointmentId;

  it('CT003 - Login com credenciais válidas', () => {
    cy.request('POST', `${base}/auth/login`, {
      email: 'paciente@vida.plus',
      password: '123456'
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.have.property('token');
      token = resp.body.token;
    });
  });

  it('CT004 - Agendar consulta (presencial)', () => {
    const payload = {
      patientId: 'p1',
      date: new Date(Date.now() + 3600_000).toISOString(),
      type: 'Presencial'
    };
    cy.request({
      method: 'POST',
      url: `${base}/appointments`,
      headers: { Authorization: `Bearer ${token}` },
      body: payload
    }).then((resp) => {
      expect(resp.status).to.eq(201);
      expect(resp.body.status).to.eq('Agendada');
      appointmentId = resp.body.id;
    });
  });

  it('CT005 - Cancelar consulta', () => {
    cy.request({
      method: 'PATCH',
      url: `${base}/appointments/${appointmentId}/cancel`,
      headers: { Authorization: `Bearer ${token}` }
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body.status).to.eq('Cancelada');
    });
  });

  it('CT006 - Atualizar prontuário (versão +1)', () => {
    cy.request({
      method: 'PUT',
      url: `${base}/records/r1`,
      headers: { Authorization: `Bearer ${token}` },
      body: { diagnostico: 'Cefaleia', observacoes: 'Hidratar' }
    }).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(resp.body).to.have.property('versao');
      expect(resp.body.versao).to.be.greaterThan(0);
    });
  });

  it('CT007 - Emitir prescrição digital', () => {
    cy.request({
      method: 'POST',
      url: `${base}/prescriptions`,
      headers: { Authorization: `Bearer ${token}` },
      body: { patientId: 'p1', medicamento: 'Dipirona 500mg', dosagem: '1 cp 8/8h' }
    }).then((resp) => {
      expect(resp.status).to.eq(201);
      expect(resp.body).to.have.property('assinaturaDigital', true);
      expect(resp.body).to.have.property('pdf');
    });
  });
});
