// ==================== VARIABLES GLOBALES ====================
let currentEncodingMethod = 'base64';
let caesarShift = 3;
let isSecretMode = false;
let messages = [];
let isDarkMode = false;

// ==================== FUNCIONES DE CODIFICACIÓN ====================

// Base64
function encodeBase64(text) {
    try {
        return btoa(unescape(encodeURIComponent(text)));
    } catch (e) {
        return "Error al codificar";
    }
}

function decodeBase64(text) {
    try {
        return decodeURIComponent(escape(atob(text)));
    } catch (e) {
        return "Error al decodificar";
    }
}

// Cifrado César
function encodeCaesar(text, shift = 3) {
    return text.split('').map(char => {
        const code = char.charCodeAt(0);
        
        if (code >= 65 && code <= 90) { // Mayúsculas
            return String.fromCharCode(((code - 65 + shift) % 26) + 65);
        }
        if (code >= 97 && code <= 122) { // Minúsculas
            return String.fromCharCode(((code - 97 + shift) % 26) + 97);
        }
        return char;
    }).join('');
}

function decodeCaesar(text, shift = 3) {
    return encodeCaesar(text, 26 - (shift % 26));
}

// Texto invertido
function encodeReverse(text) {
    return text.split('').reverse().join('');
}
function decodeReverse(text) {
    return encodeReverse(text); // Es la misma función
}

// Binario
function encodeBinary(text) {
    return text.split('').map(char => {
        return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join(' ');
}

function decodeBinary(text) {
    return text.split(' ').map(bin => {
        return String.fromCharCode(parseInt(bin, 2));
    }).join('');
}

// Hexadecimal
function encodeHex(text) {
    return text.split('').map(char => {
        return char.charCodeAt(0).toString(16).padStart(2, '0');
    }).join(' ');
}

function decodeHex(text) {
    return text.split(' ').map(hex => {
        return String.fromCharCode(parseInt(hex, 16));
    }).join('');
}

// Código Morse (simplificado)
const morseCode = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.',
    'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
    'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---',
    'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
    'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--',
    'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
    '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.', '0': '-----', ' ': '/'
};

const reverseMorse = Object.fromEntries(
    Object.entries(morseCode).map(([k, v]) => [v, k])
);

function encodeMorse(text) {
    return text.toUpperCase().split('').map(char => {
        return morseCode[char] || char;
    }).join(' ');
}

function decodeMorse(text) {
    return text.split(' ').map(code => {
        return reverseMorse[code] || code;
    }).join('');
}

// ==================== FUNCIONES PRINCIPALES ====================

function encodeText(text) {
    if (!text.trim()) return '';
    
    switch(currentEncodingMethod) {
        case 'base64':
            return encodeBase64(text);
        case 'caesar':
            return encodeCaesar(text, caesarShift);
        case 'reverse':
            return encodeReverse(text);
        case 'binary':
            return encodeBinary(text);
        case 'hex':
            return encodeHex(text);
        case 'morse':
            return encodeMorse(text);
        default:
            return text;
    }
}

function decodeText(text) {
    if (!text.trim()) return '';
    
    switch(currentEncodingMethod) {
        case 'base64':
            return decodeBase64(text);
        case 'caesar':
            return decodeCaesar(text, caesarShift);
        case 'reverse':
            return decodeReverse(text);
        case 'binary':
            return decodeBinary(text);
        case 'hex':
            return decodeHex(text);
        case 'morse':
            return decodeMorse(text);
        default:
            return text;
    }
}

function updatePreview() {
    const inputText = document.getElementById('messageInput').value;
    const encodedPreview = document.getElementById('previewEncoded');
    const decodedPreview = document.getElementById('previewDecoded');
    
    if (inputText.trim()) {
        const encoded = encodeText(inputText);
        encodedPreview.textContent = encoded;
        decodedPreview.textContent = inputText;
        
        // Estilo especial para binario y hex
        if (currentEncodingMethod === 'binary' || currentEncodingMethod === 'hex') {
            encodedPreview.style.fontSize = '0.9rem';
            encodedPreview.style.lineHeight = '1.4';
        } else {
            encodedPreview.style.fontSize = '';
            encodedPreview.style.lineHeight = '';
        }
    } else {
        encodedPreview.textContent = 'Tu mensaje codificado aparecerá aquí...';
        decodedPreview.textContent = 'Tu mensaje original aparecerá aquí...';
    }
    
    // Actualizar contador
    document.getElementById('charCount').textContent = inputText.length;
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    
    if (!text) {
        alert('Por favor, escribe un mensaje primero');
        return;
    }
    
    // Crear mensaje
    const message = {
        id: Date.now(),
        text: text,
        encoded: encodeText(text),
        method: currentEncodingMethod,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'user',
        isDecoded: false
    };
    
    // Agregar a la lista
    messages.push(message);
    
    // Agregar al DOM
    addMessageToDOM(message);
    
    // Limpiar input
    input.value = '';
    updatePreview();
    
    // Simular respuesta automática después de 1 segundo
    setTimeout(sendAutoReply, 1000);
    
    // Enfocar input de nuevo
    input.focus();
}

function addMessageToDOM(message) {
    const container = document.getElementById('messagesContainer');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.sender === 'user' ? 'sent' : 'received'}`;
    messageDiv.dataset.id = message.id;
    
    const content = `
        <div class="message-content">
            <div class="encoded-text">${message.encoded}</div>
            <div class="decoded-text">${message.text}</div>
        </div>
        <div class="message-time">${message.time}</div>
    `;
    
    messageDiv.innerHTML = content;
    container.appendChild(messageDiv);
    
    // Auto scroll al último mensaje
    container.scrollTop = container.scrollHeight;
    
    // Agregar evento de clic para revelar
    messageDiv.addEventListener('click', function() {
        this.classList.toggle('show-decoded');
    });
}

function sendAutoReply() {
    const replies = [
        "¡Mensaje recibido! ¿Qué más quieres codificar?",
        "Interesante mensaje. ¿Probamos otro método?",
        "Tu código se ve bien. Intenta con morse ahora.",
        "¿Sabías que Base64 se usa en emails?",
        "Prueba escribir algo más largo para ver cómo se codifica.",
        "El cifrado César era usado por Julio César en sus campañas militares."
    ];
    
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    
    const reply = {
        id: Date.now() + 1,
        text: randomReply,
        encoded: encodeText(randomReply),
        method: currentEncodingMethod,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'bot',
        isDecoded: false
    };
    
    messages.push(reply);
    addMessageToDOM(reply);
}

function updateMethodDescription() {
    const descriptions = {
        base64: "Base64 convierte texto en código alfanumérico. Seguro para miradas rápidas.",
        caesar: `Cifrado César desplaza letras ${caesarShift} posiciones en el alfabeto. Fácil de descifrar.`,
        reverse: "Invierte el orden del texto. Simple pero efectivo contra miradas casuales.",
        binary: "Convierte cada carácter a código binario (8 bits). Perfecto para aspecto hacker.",
        hex: "Representación hexadecimal del código ASCII. Más compacto que binario.",
        morse: "Código Morse con puntos y rayas. Clásico y reconocible."
    };
    
    document.getElementById('methodDescription').textContent = descriptions[currentEncodingMethod];
    document.getElementById('currentMethod').textContent = 
        currentEncodingMethod.charAt(0).toUpperCase() + currentEncodingMethod.slice(1);
}

// ==================== EVENT LISTENERS ====================

document.addEventListener// ==================== FUNCIONALIDAD MOBILE ====================

// Toggle sidebar en mobile
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.querySelector('.sidebar');
const mobilePreviewToggle = document.getElementById('mobilePreviewToggle');
const previewContainer = document.querySelector('.preview-container');

if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });
    
    // Cerrar sidebar al hacer clic fuera (solo mobile)
    if (window.innerWidth < 768) {
        document.addEventListener('click', function(event) {
            if (sidebar.classList.contains('active') && 
                !sidebar.contains(event.target) && 
                !sidebarToggle.contains(event.target)) {
                sidebar.classList.remove('active');
            }
        });
    }
}

// Toggle vista previa en mobile
if (mobilePreviewToggle && previewContainer) {
    mobilePreviewToggle.addEventListener('click', function() {
        previewContainer.classList.toggle('show');
        const icon = this.querySelector('i');
        if (previewContainer.classList.contains('show')) {
            icon.className = 'fas fa-eye-slash';
            this.title = 'Ocultar vista previa';
        } else {
            icon.className = 'fas fa-eye';
            this.title = 'Mostrar vista previa';
        }
    });
}

// Ajustar altura del textarea automáticamente
const messageInput = document.getElementById('messageInput');
if (messageInput) {
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
}

// Cerrar teclado virtual al enviar en iOS/Android
function dismissKeyboard() {
    if (messageInput) {
        messageInput.blur();
    }
}

// Modificar función sendMessage para mobile
const originalSendMessage = window.sendMessage;
window.sendMessage = function() {
    if (originalSendMessage) {
        originalSendMessage();
    }
    dismissKeyboard();
    
    // Cerrar sidebar en mobile después de enviar
    if (window.innerWidth < 768 && sidebar) {
        sidebar.classList.remove('active');
    }
};

// Detectar si es móvil y ajustar
function detectMobile() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Ajustes específicos para móvil
        document.body.classList.add('mobile-device');
        
        // Ocultar sidebar por defecto en mobile
        if (sidebar && window.innerWidth < 768) {
            sidebar.classList.remove('active');
        }
        
        // Mejorar experiencia táctil
        document.querySelectorAll('.message-content').forEach(msg => {
            msg.style.cursor = 'pointer';
        });
    }
}

// Ejecutar detección
setTimeout(detectMobile, 100);

// Prevenir zoom en input en iOS
if (messageInput) {
    messageInput.addEventListener('focus', function() {
        setTimeout(() => {
            this.style.fontSize = '16px';
        }, 100);
    });
    
    messageInput.addEventListener('blur', function() {
        this.style.fontSize = '';
    });
}('DOMContentLoaded', function() {
    // Inicializar
    updateMethodDescription();
    
    // Cambiar método de codificación
    document.getElementById('encodingMethod').addEventListener('change', function() {
        currentEncodingMethod = this.value;
        
        // Mostrar/ocultar configuración de César
        const caesarConfig = document.getElementById('caesarConfig');
        if (currentEncodingMethod === 'caesar') {
            caesarConfig.style.display = 'block';
        } else {
            caesarConfig.style.display = 'none';
        }
        
        updateMethodDescription();
        updatePreview();
        
        // Actualizar mensajes existentes con nuevo método
        messages.forEach(msg => {
            if (msg.sender === 'user') {
                msg.encoded = encodeText(msg.text);
            }
        });
        
        // Actualizar DOM
        document.querySelectorAll('.message').forEach(msgDiv => {
            const id = parseInt(msgDiv.dataset.id);
            const msg = messages.find(m => m.id === id);
            if (msg && msg.sender === 'user') {
                msgDiv.querySelector('.encoded-text').textContent = msg.encoded;
            }
        });
    });
    
    // Control deslizante para César
    const caesarSlider = document.getElementById('caesarShift');
    const shiftValue = document.getElementById('shiftValue');
    
    caesarSlider.addEventListener('input', function() {
        caesarShift = parseInt(this.value);
        shiftValue.textContent = caesarShift;
        
        if (currentEncodingMethod === 'caesar') {
            updateMethodDescription();
            updatePreview();
        }
    });
    
    // Modo secreto
    document.getElementById('secretModeToggle').addEventListener('change', function() {
        isSecretMode = this.checked;
        document.querySelectorAll('.message').forEach(msg => {
            if (isSecretMode) {
                msg.classList.remove('show-decoded');
            }
        });
    });
    
    // Input de mensaje
    const messageInput = document.getElementById('messageInput');
    messageInput.addEventListener('input', updatePreview);
    messageInput.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Botón enviar
    document.getElementById('sendBtn').addEventListener('click', sendMessage);
    
    // Botón codificar
    document.getElementById('encodeBtn').addEventListener('click', function() {
        const input = document.getElementById('messageInput');
        input.value = encodeText(input.value);
        updatePreview();
    });
    
    // Botón decodificar
    document.getElementById('decodeBtn').addEventListener('click', function() {
        const input = document.getElementById('messageInput');
        input.value = decodeText(input.value);
        updatePreview();
    });
    
    // Botón ver/ocultar
    document.getElementById('toggleView').addEventListener('click', function() {
        const icon = this.querySelector('i');
        const allMessages = document.querySelectorAll('.message');
        
        if (icon.classList.contains('fa-eye')) {
            icon.classList.replace('fa-eye', 'fa-eye-slash');
            allMessages.forEach(msg => msg.classList.add('show-decoded'));
        } else {
            icon.classList.replace('fa-eye-slash', 'fa-eye');
            allMessages.forEach(msg => msg.classList.remove('show-decoded'));
        }
    });
    
    // Limpiar chat
    document.getElementById('clearChat').addEventListener('click', function() {
        if (confirm('¿Estás seguro de que quieres limpiar todo el chat?')) {
            document.getElementById('messagesContainer').innerHTML = '';
            messages = [];
        }
    });
    
    // Cambiar contacto
    document.querySelectorAll('.contact').forEach(contact => {
        contact.addEventListener('click', function() {
            document.querySelectorAll('.contact').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            alert(`Ahora estás chateando con ${this.querySelector('.contact-name').textContent}`);
        });
    });
    
    // Cambiar tema
    document.getElementById('themeToggle').addEventListener('click', function() {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('dark-mode', isDarkMode);
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-moon', !isDarkMode);
        icon.classList.toggle('fa-sun', isDarkMode);
    });
    
    // Ayuda
    const helpModal = document.getElementById('helpModal');
    const helpBtn = document.getElementById('helpBtn');
    const closeModal = document.querySelector('.close-modal');
    
    helpBtn.addEventListener('click', () => {
        helpModal.style.display = 'flex';
    });
    
    closeModal.addEventListener('click', () => {
        helpModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === helpModal) {
            helpModal.style.display = 'none';
        }
    });
    
    // Efecto de carga inicial
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

});
