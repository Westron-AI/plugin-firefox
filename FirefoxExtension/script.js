import BASE_URL from './configs'

document.addEventListener('DOMContentLoaded', function () {
    const insertApiKeyButton = document.getElementById('insertApiKeyButton');
    const getApiKeyButton = document.getElementById('getApiKeyButton');
    const saveApiKeyButton = document.getElementById('saveApiKeyButton');
    const apiKeyInput = document.getElementById('inputApiKey');
    const apiAlert = document.getElementById('apiAlert');
    const credentialsSection = document.getElementById('credentialsSection');
    const loginButton = document.getElementById('loginButton');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    function showAlert(message) {
        apiAlert.textContent = message;
        apiAlert.style.display = 'block';
    }

    insertApiKeyButton?.addEventListener('click', () => {
        document.getElementById('apiKeySection').classList.remove('d-none');
    });


    saveApiKeyButton?.addEventListener('click', () => {
        const apiKey = apiKeyInput.value;
        if (apiKey) {
            localStorage.setItem('apiKey', apiKey);
            apiAlert.style.display = 'none';
            alert('Chave API salva com sucesso!');
            document.getElementById('apiKeySection').classList.add('d-none');
        } else {
            showAlert("A chave da API é obrigatória.");
        }
    });

   
    getApiKeyButton?.addEventListener('click', () => {
        credentialsSection.classList.remove('d-none');
    });

    loginButton?.addEventListener('click', async (e) => {
        e.preventDefault();
        const usuario = usernameInput.value;
        const senha = passwordInput.value;

        if (!usuario || !senha) {
            showAlert("Por favor, preencha o usuário e a senha.");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/login`, { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ usuario, senha }),
            });

            if (!response.ok) {
                throw new Error("Login falhou!");
            }

            const data = await response.json();
            console.log(data);
            localStorage.setItem('apiKey', data.access_token);


            browser.storage.local.set({ 'apiKey': data.access_token });
       

            apiAlert.style.display = 'none';
            alert('Login realizado com sucesso!');
            credentialsSection.classList.add('d-none');
  

            const savedApiKey = localStorage.getItem('apiKey');
            if (savedApiKey) {
                alert(`Sua chave API é: ${savedApiKey}`);
            } else {
                alert('Nenhuma chave API salva.');
            }
        } catch (err) {
            console.log(err);
            showAlert("Credenciais inválidas!");
        }
    });
});
