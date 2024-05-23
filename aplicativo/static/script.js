// Obtener el área de arrastrar y soltar
var dropArea = document.getElementById('drop-area');

// Agregar eventos de arrastrar y soltar
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Resaltar el área de soltar cuando se arrastra un archivo sobre ella
['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
    dropArea.classList.add('highlight');
}

function unhighlight(e) {
    dropArea.classList.remove('highlight');
    stopAnimation(); // Detener la animación cuando se sale del área de soltar
}

// Manejar el evento de soltar archivos
dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    var dt = e.dataTransfer;
    var files = dt.files;

    handleFiles(files);
}

// Manejar la carga de archivos
function handleFiles(files) {
    ([...files]).forEach(uploadFile);
}

function uploadFile(file) {
    var url = '/upload';
    var formData = new FormData();
    formData.append('file', file);

    // Enviar el archivo al servidor
    fetch(url, {
        method: 'POST',
        body: formData
    }).then(response => {
        if (response.ok) {
            console.log('Archivo subido exitosamente');
        } else {
            return response.json().then(error => {
                console.error('Error al enviar archivo:', error);
            });
        }
    }).catch(error => {
        console.error('Error al enviar archivo:', error);
    });
}

// Manejar eventos de arrastrar y soltar
function handleDragEnter(e) {
    e.preventDefault();
    dropArea.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    dropArea.classList.remove('dragover');
    stopAnimation(); // Detener la animación cuando se sale del área de soltar
}

dropArea.addEventListener('dragenter', handleDragEnter, false);
dropArea.addEventListener('dragleave', handleDragLeave, false);
dropArea.addEventListener('drop', handleDrop, false);

// Detener la animación
function stopAnimation() {
    dropArea.style.backgroundImage = 'none';
    console.log('Deteniendo animación...');
}
