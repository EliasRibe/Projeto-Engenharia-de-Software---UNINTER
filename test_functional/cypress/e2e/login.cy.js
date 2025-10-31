// Exemplo básico: visita a home do mock e valida elementos
// Ajuste os seletores conforme sua UI real quando houver


describe('SGHSS - Login (mock)', () => {
it('carrega registros e mostra título', () => {
cy.visit('http://localhost:3000/records');
// Como estamos servindo uma API, essa visita retorna JSON. Em um front real, use a URL do front.
// Para fins de starter, só validamos que a requisição responde com 200 via cy.request.
});


it('API /records responde 200', () => {
cy.request('http://localhost:3000/records').then((resp) => {
expect(resp.status).to.eq(200);
expect(resp.body).to.be.an('array');
});
});
});