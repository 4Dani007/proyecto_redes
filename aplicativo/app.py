from flask import Flask, render_template, request, redirect, url_for, jsonify
from werkzeug.utils import secure_filename
from ftplib import FTP
import os

app = Flask(__name__)

# Configuración del servidor FTP
FTP_HOST = '172.16.9.72'
FTP_USER = 'danielbm'
FTP_PASS = 'daniel'

# Rutas

@app.route('/')
def login():
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def do_login():
    username = request.form['username']
    password = request.form['password']
    
    try:
        ftp = FTP(FTP_HOST)
        ftp.login(username, password)
        ftp.quit()
        return redirect(url_for('dashboard'))
    except Exception as e:
        return render_template('login.html', error=str(e))

@app.route('/dashboard')
def dashboard():
    try:
        ftp = FTP(FTP_HOST)
        ftp.login(FTP_USER, FTP_PASS)
        files = ftp.nlst()
        ftp.quit()
        return render_template('dashboard.html', archivos=files)
    except Exception as e:
        return render_template('dashboard.html', error=str(e))

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        ftp = FTP(FTP_HOST)
        ftp.login(FTP_USER, FTP_PASS)
        file = request.files['file']
        path = request.form.get('path', '')
        filename = secure_filename(file.filename)
        ftp.storbinary(f'STOR {path}{filename}', file.stream)
        ftp.quit()
        return jsonify({'success': True})
    except Exception as e:
        app.logger.error(f"Error uploading file: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/files')
def get_files():
    try:
        ftp = FTP(FTP_HOST)
        ftp.login(FTP_USER, FTP_PASS)
        files = ftp.nlst()
        ftp.quit()
        return jsonify(files)
    except Exception as e:
        app.logger.error(f"Error retrieving files: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)