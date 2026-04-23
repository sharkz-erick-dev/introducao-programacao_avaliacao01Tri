// java.js - Funcionalidades da Loja

// Elementos do DOM
const form = document.getElementById('registro-form');
const mensagem = document.getElementById('mensagem');
const btnComprar = document.getElementById('btn-comprar');
const etapa2 = document.getElementById('etapa-2');
const checkoutForm = document.getElementById('checkout-form');
const mensagemCheckout = document.getElementById('mensagem-checkout');
const cartaoForm = document.getElementById('cartao-form');
const mensagemCartao = document.getElementById('mensagem-cartao');

// Função para mostrar a etapa 2 (continuar compra)
function mostrarEtapa2() {
  document.getElementById('etapa-1').hidden = true;
  document.getElementById('etapa-1-cadastro').hidden = true;
  etapa2.hidden = false;
  etapa2.classList.add('animado');
}

// Event listener para o botão "Comprar agora"
btnComprar.addEventListener('click', () => {
  mostrarEtapa2();
});

// Event listener para o formulário de registro
form.addEventListener('submit', event => {
  event.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;

  if (!nome || !email || !senha) {
    mensagem.textContent = 'Por favor, preencha todos os campos.';
    mensagem.classList.add('erro');
    mensagem.classList.remove('sucesso');
    return;
  }

  const usuario = { nome, email, senha };
  localStorage.setItem('usuario', JSON.stringify(usuario));

  mensagem.textContent = `Cadastro realizado com sucesso! Bem-vindo(a), ${nome}. Agora você pode prosseguir para a compra.`;
  mensagem.classList.remove('erro');
  mensagem.classList.add('sucesso');
  form.reset();
  setTimeout(mostrarEtapa2, 1200);
});

// Event listener para o formulário de checkout
checkoutForm.addEventListener('submit', event => {
  event.preventDefault();

  const endereco = document.getElementById('endereco').value.trim();
  const pagamento = document.getElementById('pagamento').value;

  if (!endereco || !pagamento) {
    mensagemCheckout.textContent = 'Por favor, escolha o endereço e a forma de pagamento.';
    mensagemCheckout.classList.add('erro');
    mensagemCheckout.classList.remove('sucesso');
    return;
  }

  // Se escolher cartão, mostrar formulário de cartão
  if (pagamento === 'cartao') {
    mostrarFormularioCartao();
  } else {
    finalizarCompra(pagamento);
  }
});

// Função para mostrar formulário de cartão
function mostrarFormularioCartao() {
  document.getElementById('checkout-form').hidden = true;
  document.getElementById('cartao-section').hidden = false;
}

// Função para finalizar compra
function finalizarCompra(formaPagamento) {
  let mensagemFinal = 'Compra finalizada! Em breve você receberá o seu Relógio Espacial X100.';

  if (formaPagamento === 'boleto') {
    mensagemFinal += ' O boleto será enviado para seu e-mail.';
  } else if (formaPagamento === 'pix') {
    mensagemFinal += ' Use o código PIX que será gerado.';
  }

  mensagemCheckout.textContent = mensagemFinal;
  mensagemCheckout.classList.remove('erro');
  mensagemCheckout.classList.add('sucesso');
  checkoutForm.reset();
}

// Event listener para o formulário de cartão
cartaoForm.addEventListener('submit', event => {
  event.preventDefault();

  const numero = document.getElementById('numero-cartao').value.trim();
  const nomeCartao = document.getElementById('nome-cartao').value.trim();
  const validade = document.getElementById('validade').value.trim();
  const cvv = document.getElementById('cvv').value.trim();

  // Validações básicas
  if (!numero || numero.length < 16) {
    mensagemCartao.textContent = 'Número do cartão inválido.';
    mensagemCartao.classList.add('erro');
    return;
  }

  if (!nomeCartao) {
    mensagemCartao.textContent = 'Nome no cartão é obrigatório.';
    mensagemCartao.classList.add('erro');
    return;
  }

  if (!validade || !/^\d{2}\/\d{2}$/.test(validade)) {
    mensagemCartao.textContent = 'Validade deve estar no formato MM/AA.';
    mensagemCartao.classList.add('erro');
    return;
  }

  if (!cvv || cvv.length < 3) {
    mensagemCartao.textContent = 'CVV inválido.';
    mensagemCartao.classList.add('erro');
    return;
  }

  // Simular processamento do cartão
  const cartao = {
    numero: numero.replace(/\d(?=\d{4})/g, '*'), // Mascara os primeiros dígitos
    nome: nomeCartao,
    validade: validade,
    cvv: '***'
  };

  localStorage.setItem('cartao', JSON.stringify(cartao));

  mensagemCartao.textContent = 'Cartão cadastrado com sucesso! Processando pagamento...';
  mensagemCartao.classList.remove('erro');
  mensagemCartao.classList.add('sucesso');

  // Simular processamento e finalizar
  setTimeout(() => {
    finalizarCompra('cartao');
    document.getElementById('cartao-section').hidden = true;
    document.getElementById('checkout-form').hidden = false;
  }, 2000);
});

// Máscara para validade do cartão
document.getElementById('validade').addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4);
  }
  e.target.value = value;
});

// Máscara para número do cartão
document.getElementById('numero-cartao').addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');
  value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
  e.target.value = value;
});
