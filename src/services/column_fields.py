from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import random
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:8080", "http://localhost:8000"]}})

# 配置文件路径
COLUMNS_CONFIG_FILE = os.path.join(os.path.dirname(__file__), 'columns_config.json')
# UDP 数据存储文件路径
UDP_DATA_FILE = os.path.join(os.path.dirname(__file__), 'udp_data.json')

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

def load_udp_data():
    """加载 UDP 数据"""
    if os.path.exists(UDP_DATA_FILE):
        with open(UDP_DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return None

def save_udp_data(data):
    """保存 UDP 数据"""
    with open(UDP_DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def generate_udp_data():
    """生成模拟 UDP 数据（2000条）"""
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
    return generated_data

def get_or_create_udp_data():
    """获取或创建 UDP 数据"""
    data = load_udp_data()
    if data is None:
        data = generate_udp_data()
        save_udp_data(data)
    return data

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


@app.route('/api/get_udp_data', methods=['GET', 'POST'])
def get_udp_data():
    """
    获取UDP数据接口（支持分页、排序、搜索）

    GET/POST 参数:
    - page: 页码（默认1）
    - pageSize: 每页条数（默认100）
    - sortField: 排序字段
    - sortOrder: 排序方向 asc/desc
    - remote_ip: 搜索条件-对端地址（模糊匹配）
    - data_type: 搜索条件-数据类型
    - task_status: 搜索条件-任务状态
    """
    # 支持 GET 和 POST 两种方式获取参数
    if request.method == 'POST':
        params = request.get_json() or {}
    else:
        params = request.args.to_dict()

    # 分页参数
    page = int(params.get('page', 1))
    page_size = int(params.get('pageSize', 100))

    # 排序参数
    sort_field = params.get('sortField')
    sort_order = params.get('sortOrder')  # 'asc' or 'desc'

    # 搜索参数
    search_remote_ip = params.get('remote_ip', '').strip()
    search_data_type = params.get('data_type', '').strip()
    search_task_status = params.get('task_status', '').strip()

    # 获取数据
    all_data = get_or_create_udp_data()

    # 搜索过滤
    filtered_data = all_data
    if search_remote_ip:
        filtered_data = [d for d in filtered_data if search_remote_ip in d.get('remote_ip', '')]
    if search_data_type:
        filtered_data = [d for d in filtered_data if d.get('data_type') == search_data_type]
    if search_task_status:
        filtered_data = [d for d in filtered_data if d.get('task_status') == search_task_status]

    # 排序
    if sort_field and sort_order:
        reverse = sort_order == 'desc'
        # 处理数值类型字段
        numeric_fields = ['send_ok_pkts', 'send_fl_pkts', 'send_ok_bytes', 'send_fl_bytes', 'remote_port']
        if sort_field in numeric_fields:
            filtered_data.sort(key=lambda x: float(x.get(sort_field, 0) or 0), reverse=reverse)
        else:
            filtered_data.sort(key=lambda x: str(x.get(sort_field, '') or ''), reverse=reverse)

    # 计算总数
    total = len(filtered_data)

    # 分页
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    paged_data = filtered_data[start_idx:end_idx]

    return jsonify({
        "code": 0,
        "message": "success",
        "data": {
            "list": paged_data,
            "total": total,
            "page": page,
            "pageSize": page_size
        }
    })


@app.route('/api/udp_data', methods=['POST'])
def add_udp_data():
    """
    新增 UDP 数据

    POST body:
    - data_type: 数据类型
    - sock_type: 连接类型
    - remote_ip: 对端地址
    - remote_port: 对端端口
    - send_ok_pkts: 发送成功帧数
    - send_fl_pkts: 发送失败帧数
    - send_ok_bytes: 发送成功字节数
    - send_fl_bytes: 发送失败字节数
    - task_status: 任务执行状态
    - other: 空包过滤
    """
    try:
        new_item = request.get_json()

        # 获取现有数据
        all_data = get_or_create_udp_data()

        # 生成新 ID
        max_id = max([d['id'] for d in all_data]) if all_data else 0
        new_item['id'] = max_id + 1

        # 设置更新时间
        new_item['update_time'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        new_item['oper'] = ""

        # 添加到数据列表
        all_data.append(new_item)
        save_udp_data(all_data)

        return jsonify({
            "code": 0,
            "message": "success",
            "data": new_item
        })
    except Exception as e:
        return jsonify({
            "code": -1,
            "message": str(e),
            "data": None
        })


@app.route('/api/udp_data/<int:item_id>', methods=['PUT'])
def update_udp_data(item_id):
    """
    更新 UDP 数据

    URL 参数:
    - item_id: 数据项 ID

    POST body: 要更新的字段
    """
    try:
        update_data = request.get_json()

        # 获取现有数据
        all_data = get_or_create_udp_data()

        # 查找要更新的项
        item_index = None
        for i, item in enumerate(all_data):
            if item['id'] == item_id:
                item_index = i
                break

        if item_index is None:
            return jsonify({
                "code": -1,
                "message": f"未找到 ID 为 {item_id} 的数据",
                "data": None
            })

        # 更新数据（保留 id 和不可修改的字段）
        updated_item = {**all_data[item_index], **update_data}
        updated_item['id'] = item_id  # 确保 ID 不被修改
        updated_item['update_time'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        all_data[item_index] = updated_item
        save_udp_data(all_data)

        return jsonify({
            "code": 0,
            "message": "success",
            "data": updated_item
        })
    except Exception as e:
        return jsonify({
            "code": -1,
            "message": str(e),
            "data": None
        })


@app.route('/api/udp_data/<int:item_id>', methods=['DELETE'])
def delete_udp_data(item_id):
    """
    删除 UDP 数据

    URL 参数:
    - item_id: 数据项 ID
    """
    try:
        # 获取现有数据
        all_data = get_or_create_udp_data()

        # 查找要删除的项
        item_index = None
        for i, item in enumerate(all_data):
            if item['id'] == item_id:
                item_index = i
                break

        if item_index is None:
            return jsonify({
                "code": -1,
                "message": f"未找到 ID 为 {item_id} 的数据",
                "data": None
            })

        # 删除数据
        deleted_item = all_data.pop(item_index)
        save_udp_data(all_data)

        return jsonify({
            "code": 0,
            "message": "success",
            "data": deleted_item
        })
    except Exception as e:
        return jsonify({
            "code": -1,
            "message": str(e),
            "data": None
        })


@app.route('/api/udp_data/batch_delete', methods=['POST'])
def batch_delete_udp_data():
    """
    批量删除 UDP 数据

    POST body:
    - ids: 要删除的 ID 列表
    """
    try:
        params = request.get_json()
        ids_to_delete = params.get('ids', [])

        if not ids_to_delete:
            return jsonify({
                "code": -1,
                "message": "请提供要删除的 ID 列表",
                "data": None
            })

        # 获取现有数据
        all_data = get_or_create_udp_data()

        # 过滤掉要删除的数据
        ids_set = set(ids_to_delete)
        new_data = [d for d in all_data if d['id'] not in ids_set]
        deleted_count = len(all_data) - len(new_data)

        save_udp_data(new_data)

        return jsonify({
            "code": 0,
            "message": f"成功删除 {deleted_count} 条数据",
            "data": {"deleted_count": deleted_count}
        })
    except Exception as e:
        return jsonify({
            "code": -1,
            "message": str(e),
            "data": None
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
