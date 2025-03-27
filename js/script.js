// Controle do Dark Mode
const darkModeSwitch = document.getElementById('darkModeSwitch');
const rootElement = document.documentElement;

// Verificar preferência salva ou do sistema
function checkDarkModePreference() {
    const savedPreference = localStorage.getItem('darkMode');
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedPreference === 'enabled' || (savedPreference === null && systemPreference)) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
}

// Alternar dark mode
darkModeSwitch.addEventListener('change', () => {
    if (darkModeSwitch.checked) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
});

function enableDarkMode() {
    rootElement.setAttribute('data-theme', 'dark');
    darkModeSwitch.checked = true;
    localStorage.setItem('darkMode', 'enabled');
}

function disableDarkMode() {
    rootElement.removeAttribute('data-theme');
    darkModeSwitch.checked = false;
    localStorage.setItem('darkMode', 'disabled');
}

// Atualizar media query do sistema
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('darkMode')) {
        if (e.matches) {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    }
});

// Inicializar
checkDarkModePreference();

// Controle do Formulário
document.getElementById('healtrack').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const btnSubmit = document.querySelector('.submit-btn');
    const statusMessage = document.getElementById('statusMessage');
    const btnContent = btnSubmit.querySelector('.btn-content');
    const loader = btnContent.querySelector('.loader');
    
    // Mostrar loader
    loader.style.display = 'block';
    btnContent.querySelector('.btn-text').textContent = 'Enviando...';
    btnSubmit.disabled = true;
    statusMessage.className = 'status-message';
    
    try {
        const formData = {
            nome: document.getElementById('nome').value,
            sexo: document.getElementById('sexo').value,
            idade: document.getElementById('idade').value,
            peso: parseFloat(document.getElementById('peso').value),
            altura: parseInt(document.getElementById('altura').value),
            tipo_treino: document.getElementById('tipo_treino').value,
            intensidade: document.getElementById('intensidade').value,
            tempo_treino: parseInt(document.getElementById('tempo_treino').value),
            frequencia: document.getElementById('frequencia').value,
            gasto_calorico: parseInt(document.getElementById('gasto_calorico').value),
            agua: parseInt(document.getElementById('agua').value),
            refeicoes: parseInt(document.getElementById('refeicoes').value),
            calorias: parseInt(document.getElementById('calorias').value),
            suplementacao: document.querySelector('input[name="suplementacao"]:checked').value,
            nutricionista: document.querySelector('input[name="nutricionista"]:checked').value
        };
        
        // Adicionar timeout para evitar falha prematura
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        const response = await fetch('https://api.sheetmonkey.io/form/2dcxE6ZnbbphvsByB5QKsb', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        statusMessage.textContent = 'Dados enviados com sucesso!';
        statusMessage.className = 'status-message success';
        this.reset();
        
    } catch (error) {
        console.error('Erro ao enviar dados:', error);
        
        if (error.name === 'AbortError') {
            statusMessage.textContent = 'O servidor está demorando muito para responder. Os dados podem ter sido enviados mesmo assim.';
            statusMessage.className = 'status-message success';
        } else {
            statusMessage.textContent = `Erro: ${error.message}`;
            statusMessage.className = 'status-message error';
        }
        
    } finally {
        loader.style.display = 'none';
        btnContent.querySelector('.btn-text').textContent = 'Enviar';
        btnSubmit.disabled = false;
    }
});