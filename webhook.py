from flask import Blueprint, request, jsonify
import requests
import json
from datetime import datetime

webhook_bp = Blueprint('webhook', __name__)

@webhook_bp.route('/form-submit', methods=['POST'])
def handle_form_submission():
    """
    Endpoint para receber dados do formulário e enviar via webhook
    """
    try:
        # Recebe os dados do formulário
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Nenhum dado recebido'}), 400
        
        # Valida campos obrigatórios
        required_fields = ['name', 'email', 'service']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Campo obrigatório: {field}'}), 400
        
        # Prepara a mensagem formatada
        message = format_message(data)
        
        # Aqui você pode configurar diferentes tipos de webhook
        # Por exemplo, enviar para Discord, Slack, Telegram, etc.
        
        # Exemplo para Discord Webhook (descomente e configure se necessário)
        # discord_webhook_url = "SUA_URL_DO_DISCORD_WEBHOOK"
        # send_to_discord(message, discord_webhook_url)
        
        # Exemplo para Slack Webhook (descomente e configure se necessário)
        # slack_webhook_url = "SUA_URL_DO_SLACK_WEBHOOK"
        # send_to_slack(message, slack_webhook_url)
        
        # Exemplo para Telegram Bot (descomente e configure se necessário)
        # telegram_bot_token = "SEU_BOT_TOKEN"
        # telegram_chat_id = "SEU_CHAT_ID"
        # send_to_telegram(message, telegram_bot_token, telegram_chat_id)
        
        # Por enquanto, apenas salva os dados localmente para demonstração
        save_submission_locally(data)
        
        return jsonify({
            'success': True,
            'message': 'Formulário enviado com sucesso!'
        }), 200
        
    except Exception as e:
        print(f"Erro ao processar formulário: {str(e)}")
        return jsonify({'error': 'Erro interno do servidor'}), 500

def format_message(data):
    """
    Formata os dados do formulário em uma mensagem legível
    """
    timestamp = datetime.now().strftime("%d/%m/%Y às %H:%M")
    
    message = f"""
🌞 **Nova Solicitação - M Sol Energia**

📅 **Data/Hora:** {timestamp}
👤 **Nome:** {data.get('name', 'Não informado')}
📧 **Email:** {data.get('email', 'Não informado')}
📱 **Telefone:** {data.get('phone', 'Não informado')}
🏗️ **Tipo de Projeto:** {data.get('service', 'Não informado')}

💬 **Mensagem:**
{data.get('message', 'Nenhuma mensagem adicional')}

---
Enviado através do site M Sol Energia e Engenharia
    """.strip()
    
    return message

def send_to_discord(message, webhook_url):
    """
    Envia mensagem para Discord via webhook
    """
    payload = {
        "content": message,
        "username": "M Sol Energia - Site"
    }
    
    response = requests.post(webhook_url, json=payload)
    response.raise_for_status()

def send_to_slack(message, webhook_url):
    """
    Envia mensagem para Slack via webhook
    """
    payload = {
        "text": message,
        "username": "M Sol Energia - Site"
    }
    
    response = requests.post(webhook_url, json=payload)
    response.raise_for_status()

def send_to_telegram(message, bot_token, chat_id):
    """
    Envia mensagem para Telegram via Bot API
    """
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": message,
        "parse_mode": "Markdown"
    }
    
    response = requests.post(url, json=payload)
    response.raise_for_status()

def save_submission_locally(data):
    """
    Salva a submissão localmente para demonstração
    """
    import os
    
    # Cria diretório se não existir
    submissions_dir = os.path.join(os.path.dirname(__file__), '..', 'submissions')
    os.makedirs(submissions_dir, exist_ok=True)
    
    # Salva com timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"submission_{timestamp}.json"
    filepath = os.path.join(submissions_dir, filename)
    
    # Adiciona timestamp aos dados
    data['submitted_at'] = datetime.now().isoformat()
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"Submissão salva em: {filepath}")

