import { C as g, a as c, E as x } from './index-DoKEHKv3.js';
import {
  d as y,
  r as u,
  j as r,
  a as b,
  g as _,
  b as D,
  u as R,
  c as M,
  s as i,
  e as w,
  B as m,
} from './bootstrap-CaGnHU9H.js';
import { F as j } from './Form-B4colF74.js';
import './Dialog-ytVFg8Gx.js';
import 'D:/work/base_web/node_modules/dayjs/dayjs.min.js';
import 'D:\\work\\base_web\\node_modules\\react\\cjs\\react.production.min.js';
import 'D:\\work\\base_web\\node_modules\\history\\cjs\\history.min.js';
import 'D:\\work\\base_web\\node_modules\\react-dom\\cjs\\react-dom.production.min.js';
import 'D:\\work\\base_web\\node_modules\\rc-util\\node_modules\\react-is\\cjs\\react-is.production.min.js';
import 'D:\\work\\base_web\\node_modules\\react\\cjs\\react-jsx-runtime.production.min.js';
import './main-Bsls2Jb-.js';
import './_baseSet-BT-05xLc.js';
import 'D:\\work\\base_web\\node_modules\\react-is\\cjs\\react-is.production.min.js';
var p, f, d;
function o(a, s, e) {
  return (
    (s = C(s)) in a
      ? Object.defineProperty(a, s, { value: e, enumerable: !0, configurable: !0, writable: !0 })
      : (a[s] = e),
    a
  );
}
function C(a) {
  var s = F(a, 'string');
  return typeof s == 'symbol' ? s : s + '';
}
function F(a, s) {
  if (typeof a != 'object' || !a) return a;
  var e = a[Symbol.toPrimitive];
  if (e !== void 0) {
    var t = e.call(a, s);
    if (typeof t != 'object') return t;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (s === 'string' ? String : Number)(a);
}
let N = ((p = j.create()),
(f = y.connect(({ main: a }) => ({
  masterIp: a.masterIp,
  globalNodeType: a.globalNodeType || 'normal',
}))),
p(
  (d =
    f(
      (d = class extends u.PureComponent {
        constructor(s) {
          super(s),
            o(this, 'updateHeaders', e => {
              const t = b(e);
              console.log(e, 12333);
              const n = {
                title: '操作',
                dataIndex: 'oper',
                fixed: 'right',
                width: 120,
                is_disabled: !0,
                render: (l, h) =>
                  r.jsxs('span', {
                    children: [
                      r.jsx('a', { onClick: () => this.handleEdit(h), children: '编辑' }),
                      ' | ',
                      r.jsx('a', {
                        onClick: () => this.handleDelete(h.id),
                        style: { color: '#ff4d4f' },
                        children: '删除',
                      }),
                    ],
                  }),
              };
              this.setState({ columns: [...t, n] });
            }),
            o(this, 'fetchData', (e, t) => {
              const n = { ...e, page: e.currentPage, sortField: e.sorter, sortOrder: e.order };
              delete n.currentPage,
                delete n.sorter,
                delete n.order,
                _(n, l => {
                  t(l.data);
                });
            }),
            o(this, 'handleRefresh', () => {
              this.setState(e => ({ refreshFlag: !e.refreshFlag }));
            }),
            o(this, 'handleAdd', () => {
              const e = {
                data_type: 'UDP',
                sock_type: 'TCP',
                remote_ip: `${Math.floor(Math.random() * 255)}.${Math.floor(
                  Math.random() * 255
                )}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
                remote_port: String(Math.floor(Math.random() * 64512) + 1024),
                send_ok_pkts: Math.floor(Math.random() * 1e4),
                send_fl_pkts: Math.floor(Math.random() * 50),
                send_ok_bytes: Math.floor(Math.random() * 5e6),
                send_fl_bytes: Math.floor(Math.random() * 1e3),
                task_status: '运行中',
                other: '已启用',
              };
              D(e, t => {
                t.code === 0
                  ? (i.success('新增成功'), this.handleRefresh())
                  : i.error(t.message || '新增失败');
              });
            }),
            o(this, 'handleEdit', e => {
              const t = { ...e, task_status: e.task_status === '运行中' ? '暂停' : '运行中' };
              R(e.id, t, n => {
                n.code === 0
                  ? (i.success('更新成功'), this.handleRefresh())
                  : i.error(n.message || '更新失败');
              });
            }),
            o(this, 'handleDelete', e => {
              M(e, t => {
                t.code === 0
                  ? (i.success('删除成功'), this.handleRefresh())
                  : i.error(t.message || '删除失败');
              });
            }),
            o(this, 'handleBatchDelete', () => {
              const { selectedRowKeys: e } = this.state;
              if (!e || e.length === 0) {
                i.warning('请先选择要删除的数据');
                return;
              }
              w(e, t => {
                t.code === 0
                  ? (i.success(`成功删除 ${t.data.deleted_count} 条数据`),
                    this.setState({ selectedRowKeys: [] }),
                    this.handleRefresh())
                  : i.error(t.message || '批量删除失败');
              });
            }),
            o(this, 'renderExtra', () =>
              r.jsxs('span', {
                children: [
                  r.jsx(m, {
                    type: 'primary',
                    onClick: this.handleAdd,
                    style: { marginRight: 8 },
                    children: '新增',
                  }),
                  r.jsx(m, {
                    danger: !0,
                    onClick: this.handleBatchDelete,
                    style: { marginRight: 8 },
                    children: '批量删除',
                  }),
                  r.jsx(x, { type: 'udp_show_config', updateHeaders: this.updateHeaders }),
                ],
              })
            ),
            o(this, 'expandedRowRender', e =>
              r.jsx(c, {
                height: 200,
                columns: this.columns,
                data: this.subData,
                enableColumnDrag: !0,
                pagination: !1,
              })
            ),
            o(this, 'onSelectedRow', e => {
              this.setState({ selectedRowKeys: e });
            }),
            (this.state = { columns: [], refreshFlag: !1, selectedRowKeys: [] }),
            (this.columns = [
              { title: '姓名', dataIndex: 'name' },
              { title: '年龄', dataIndex: 'age' },
              { title: '性别', dataIndex: 'xb' },
            ]),
            (this.subData = []);
          for (let e = 0; e < 200; e++)
            this.subData.push({ id: e, name: `姓名${e}`, age: `年龄${e}`, xb: `性别${e}` });
        }
        componentDidMount() {}
        render() {
          const { columns: s, refreshFlag: e } = this.state;
          return r.jsx(u.Fragment, {
            children: r.jsx(g, {
              title: 'UDP数据 (AG Grid)',
              extra: this.renderExtra(),
              children: r.jsx(c, {
                height: 500,
                columns: s,
                fetchData: this.fetchData,
                dataField: 'list',
                isUpdate: e,
                pageSize: 100,
                enableRowDrag: !0,
                enableColumnDrag: !0,
                onSelectRow: this.onSelectedRow,
                expandedRowRender: this.expandedRowRender,
                pagination: !0,
              }),
            }),
          });
        }
      })
    ) || d)
) || d);
export { N as default };
