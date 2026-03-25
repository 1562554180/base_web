from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import random
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:8080"}})

# 配置文件路径
COLUMNS_CONFIG_FILE = os.path.join(os.path.dirname(__file__), 'columns_config.json')

def load_columns_config():
    """加载配置文件"""
    if os.path.exists(COLUMNS_CONFIG_FILE):
        with open(COLUMNS_CONFIG_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def save_columns_config(config):
    """保存配置文件"""
    with open(COLUMNS_CONFIG_FILE, 'w', encoding='utf-8') as f:
        json.dump(config, f, ensure_ascii=False, indent=2)

# 表头配置
COLUMNS_CONFIG = [
    {"ch_name": "数据类型", "en_name": "data_type", "id": "0", "width": "115"},
    {"ch_name": "连接类型", "en_name": "sock_type", "id": "1"},
    {"ch_name": "对端地址", "en_name": "remote_ip", "id": "2"},
    {"ch_name": "对端端口", "en_name": "remote_port", "id": "3"},
    {"ch_name": "发送成功帧数", "en_name": "send_ok_pkts", "id": "4"},
    {"ch_name": "发送失败帧数", "en_name": "send_fl_pkts", "hidden": "0", "id": "5"},
    {"ch_name": "发送成功字节数", "en_name": "send_ok_bytes", "id": "6"},
    {"ch_name": "发送失败字节数", "en_name": "send_fl_bytes", "hidden": "0", "id": "7"},
    {"ch_name": "任务执行状态", "en_name": "task_status", "id": "8"},
    {"ch_name": "更新时间", "en_name": "update_time", "id": "9", "width": "160"},
    {"ch_name": "空包过滤", "en_name": "other", "id": "10"},
    {"ch_name": "操作", "en_name": "oper", "id": "11"}
]


@app.route('/api/column_fields', methods=['GET'])
def get_column_fields():
    """
    获取表格列字段名接口
    返回所有表头的en_name字段值
    """
    fields = [col["en_name"] for col in COLUMNS_CONFIG]
    return jsonify({
        "code": 0,
        "message": "success",
        "data": {
            "fields": fields
        }
    })


@app.route('/api/columns', methods=['GET'])
def get_columns():
    """
    获取完整表头配置接口
    返回所有表头信息
    """
    return jsonify({
        "code": 0,
        "message": "success",
        "data": COLUMNS_CONFIG
    })


# 模拟UDP数据
UDP_DATA = [
    {
        "data_type": "UDP",
        "sock_type": "TCP",
        "remote_ip": "192.168.1.100",
        "remote_port": "8080",
        "send_ok_pkts": 1250,
        "send_fl_pkts": 3,
        "send_ok_bytes": 512000,
        "send_fl_bytes": 128,
        "task_status": "运行中",
        "update_time": "2024-03-18 10:30:00",
        "other": "已启用",
        "oper": ""
    },
    {
        "data_type": "TCP",
        "sock_type": "UDP",
        "remote_ip": "10.0.0.55",
        "remote_port": "443",
        "send_ok_pkts": 3580,
        "send_fl_pkts": 12,
        "send_ok_bytes": 1024000,
        "send_fl_bytes": 512,
        "task_status": "运行中",
        "update_time": "2024-03-18 10:28:45",
        "other": "已启用",
        "oper": ""
    },
    {
        "data_type": "UDP",
        "sock_type": "TCP",
        "remote_ip": "172.16.0.20",
        "remote_port": "9090",
        "send_ok_pkts": 890,
        "send_fl_pkts": 0,
        "send_ok_bytes": 256000,
        "send_fl_bytes": 0,
        "task_status": "已完成",
        "update_time": "2024-03-18 09:15:30",
        "other": "未启用",
        "oper": ""
    },
    {
        "data_type": "TCP",
        "sock_type": "TCP",
        "remote_ip": "192.168.2.200",
        "remote_port": "3306",
        "send_ok_pkts": 5670,
        "send_fl_pkts": 8,
        "send_ok_bytes": 2048000,
        "send_fl_bytes": 256,
        "task_status": "运行中",
        "update_time": "2024-03-18 10:31:12",
        "other": "已启用",
        "oper": ""
    },
    {
        "data_type": "UDP",
        "sock_type": "UDP",
        "remote_ip": "10.10.10.1",
        "remote_port": "53",
        "send_ok_pkts": 2400,
        "send_fl_pkts": 5,
        "send_ok_bytes": 76800,
        "send_fl_bytes": 64,
        "task_status": "暂停",
        "update_time": "2024-03-18 08:45:00",
        "other": "已启用",
        "oper": ""
    }
]


@app.route('/api/get_udp_data', methods=['GET'])
def get_udp_data():
    """
    获取UDP数据接口
    返回模拟的UDP数据列表
    """
    # 生成2000条模拟数据
    data_types = ["UDP", "TCP"]
    sock_types = ["TCP", "UDP"]
    task_statuses = ["运行中", "已完成", "暂停", "等待中"]
    other_statuses = ["已启用", "未启用"]

    def generate_random_ip():
        return f"{random.randint(1, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}.{random.randint(1, 254)}"

    def generate_random_time(base_time, offset_seconds):
        new_time = base_time + timedelta(seconds=offset_seconds)
        return new_time.strftime("%Y-%m-%d %H:%M:%S")

    base_time = datetime.now() - timedelta(minutes=2000)

    generated_data = []
    for i in range(2000):
        generated_data.append({
            "id": i + 1,
            "data_type": random.choice(data_types),
            "sock_type": random.choice(sock_types),
            "remote_ip": generate_random_ip(),
            "remote_port": str(random.randint(1024, 65535)),
            "send_ok_pkts": random.randint(100, 10000),
            "send_fl_pkts": random.randint(0, 50),
            "send_ok_bytes": random.randint(10000, 5000000),
            "send_fl_bytes": random.randint(0, 1000),
            "task_status": random.choice(task_statuses),
            "update_time": generate_random_time(base_time, i * 30),
            "other": random.choice(other_statuses),
            "oper": ""
        })

    return jsonify({
        "code": 0,
        "message": "success",
        "data": generated_data
    })


@app.route('/api/column_config', methods=['POST'])
def column_config():
    """
    列配置接口

    参数:
    - Command: 命令类型
        - get_column_type_params: 获取指定type的配置
        - set_column_type_params: 设置指定type的配置
    - params: 参数对象
        - type: 配置类型 (必填)
        - config: 配置数据JSON字符串 (set命令时必填)

    返回:
    - code: 状态码 (0=成功, -1=失败)
    - message: 提示信息
    - data: 返回数据
    """
    try:
        data = request.get_json()
        command = data.get('Command')
        params = data.get('params', {})

        # 校验必填参数
        if not command:
            return jsonify({"code": -1, "message": "Command参数必填", "data": None})

        config_type = params.get('type')
        if not config_type:
            return jsonify({"code": -1, "message": "params.type参数必填", "data": None})

        if command == 'get_column_type_params':
            # 获取配置
            all_config = load_columns_config()
            config_data = all_config.get(config_type, [])
            return jsonify({
                "code": 0,
                "message": "success",
                "data": config_data
            })

        elif command == 'set_column_type_params':
            # 设置配置
            config_str = params.get('config')
            if config_str is None:
                return jsonify({"code": -1, "message": "params.config参数必填", "data": None})

            try:
                # 解析JSON字符串
                if isinstance(config_str, str):
                    config_value = json.loads(config_str)
                else:
                    config_value = config_str
            except json.JSONDecodeError:
                return jsonify({"code": -1, "message": "config不是有效的JSON格式", "data": None})

            # 加载、更新、保存配置
            all_config = load_columns_config()
            all_config[config_type] = config_value
            save_columns_config(all_config)

            return jsonify({
                "code": 0,
                "message": "success",
                "data": None
            })

        else:
            return jsonify({"code": -1, "message": f"未知的Command: {command}", "data": None})

    except Exception as e:
        return jsonify({"code": -1, "message": f"服务器错误: {str(e)}", "data": None})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
