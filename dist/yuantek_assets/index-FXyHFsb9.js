import { r as m, j as e, B as A, M as te, i as re, s as _ } from './bootstrap-CaGnHU9H.js';
import { C as ne, a as se, E as ae } from './index-DoKEHKv3.js';
import {
  F as b,
  R as S,
  C as I,
  I as k,
  a as ie,
  D as N,
  b as M,
  c as E,
  S as oe,
  T as R,
  P as le,
} from './Dialog-ytVFg8Gx.js';
import 'D:\\work\\base_web\\node_modules\\react\\cjs\\react.production.min.js';
import 'D:\\work\\base_web\\node_modules\\history\\cjs\\history.min.js';
import 'D:\\work\\base_web\\node_modules\\react-dom\\cjs\\react-dom.production.min.js';
import 'D:\\work\\base_web\\node_modules\\rc-util\\node_modules\\react-is\\cjs\\react-is.production.min.js';
import 'D:\\work\\base_web\\node_modules\\react\\cjs\\react-jsx-runtime.production.min.js';
import './main-Bsls2Jb-.js';
import 'D:/work/base_web/node_modules/dayjs/dayjs.min.js';
const de = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
  T = 1,
  L = 65535,
  ue = /^[0-9A-Fa-f]+$/,
  ce = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,16}$/,
  pe = (t, n = !1) => {
    const s = [];
    switch ((n && s.push({ required: !0, message: '此项为必填项' }), t)) {
      case 'ip':
        s.push({ pattern: de, message: '请输入正确的 IP 地址格式，如：192.168.1.1' });
        break;
      case 'port':
        s.push({
          validator: (a, o) => {
            if (o == null || o === '') return Promise.resolve();
            const p = Number(o);
            return isNaN(p) || p < T || p > L
              ? Promise.reject(new Error(`端口号范围：${T}-${L}`))
              : Promise.resolve();
          },
        });
        break;
      case 'hex':
        s.push({ pattern: ue, message: '请输入正确的十六进制格式，如：1A2B3C' });
        break;
      case 'passport':
        s.push({ pattern: ce, message: '密码长度6-16位，必须包含数字、大写字母和小写字母' });
        break;
    }
    return s;
  },
  he = (t, n) => (n ? (Array.isArray(n) || (n = [n]), [...t, ...n]) : t),
  me = (t, n) =>
    `${{
      input: '请输入',
      select: '请选择',
      ip: '请输入',
      port: '请输入',
      hex: '请输入',
      passport: '请输入',
      number: '请输入',
      number_range: '请输入',
      textarea: '请输入',
      radio: '请选择',
      radio_group: '请选择',
      checkbox: '请选择',
      checkbox_group: '请选择',
      date: '请选择',
      date_range: '请选择',
      cascader: '请选择',
      color: '请选择',
    }[t] || '请输入'}${n || ''}`,
  fe = t =>
    Array.isArray(t)
      ? t
      : t && typeof t == 'object'
        ? Object.keys(t).map(n => ({ field_name: n, ...t[n] }))
        : [],
  xe = (t = {}) => ({ valueKey: t.value || 'key', labelKey: t.label || 'value' }),
  be = (t = [], n = {}) => {
    const { valueKey: s, labelKey: a } = xe(n);
    return t.map(
      o =>
        typeof o == 'string' || typeof o == 'number'
          ? { value: o, label: String(o) }
          : { ...o, value: o[s], label: o[a] }
    );
  },
  { TextArea: ge, Password: ye } = k,
  { RangePicker: je } = N,
  Ce = (t, n, s) =>
    t
      ? t.show !== void 0
        ? t.show(n, s)
        : t.equals !== void 0
          ? n === t.equals
          : t.notEquals !== void 0
            ? n !== t.notEquals
            : t.in !== void 0
              ? t.in.includes(n)
              : t.notIn !== void 0
                ? !t.notIn.includes(n)
                : !0
      : !0,
  q = m.forwardRef((t, n) => {
    const {
        items: s,
        formItemLayout: a = { label: 8, wrapper: 16 },
        onSubmit: o,
        onReset: p,
        values: F = {},
        linkageConfig: h,
        onValuesChange: v,
      } = t,
      [f] = b.useForm(),
      O = m.useRef({}),
      P = m.useMemo(() => fe(s), [s]);
    m.useMemo(
      () => {
        const r = new Set();
        return (
          Object.values(h?.visibleWhen || {}).forEach(l => {
            r.add(l.field);
          }),
          Object.entries(h?.optionsLinkage || {}).forEach(([l, i]) => {
            (Array.isArray(i.dependOn) ? i.dependOn : [i.dependOn]).forEach(d => r.add(d));
          }),
          Array.from(r)
        );
      },
      [h]
    ),
      m.useImperativeHandle(n, () => ({
        validateFields: () => f.validateFields(),
        resetFields: () => f.resetFields(),
        setFieldsValue: r => f.setFieldsValue(r),
        getFieldValue: r => f.getFieldValue(r),
        getFieldsValue: () => f.getFieldsValue(),
        submit: () => f.submit(),
      }));
    const V = m.useCallback(
        (r, l) => {
          const i = h?.visibleWhen?.[r];
          if (!i) return !0;
          const c = l[i.field];
          return Ce(i, c, l);
        },
        [h]
      ),
      K = m.useCallback(
        (r, l) => {
          const i = h?.optionsLinkage?.[r.field_name];
          if (!i) return r.options;
          const c = Array.isArray(i.dependOn) ? i.dependOn : [i.dependOn],
            d = i.separator || '.',
            u = c.map(g => l[g]).join(d);
          return i.map[u] || r.options || [];
        },
        [h]
      ),
      z = m.useCallback(
        (r, l) => {
          if ((console.log('chang', r, l), h?.optionsLinkage)) {
            const i = Object.keys(r),
              c = {};
            Object.entries(h.optionsLinkage).forEach(([d, u]) => {
              const g = Array.isArray(u.dependOn) ? u.dependOn : [u.dependOn];
              u.clearOnDepChange !== !1 &&
                i.some(j => g.includes(j)) &&
                l[d] !== void 0 &&
                l[d] !== null &&
                l[d] !== '' &&
                (c[d] = void 0);
            }),
              Object.keys(c).length > 0 && f.setFieldsValue(c);
          }
          (O.current = { ...l }), v?.(r, l);
        },
        [h, f, v]
      ),
      H = async () => {
        try {
          const r = await f.validateFields(),
            l = { ...r };
          P.forEach(i => {
            if (i.type === 'number_range') {
              const c = i.field_name,
                d = `${c}_min`,
                u = `${c}_max`;
              (r[d] !== void 0 || r[u] !== void 0) &&
                ((l[c] = { min: r[d], max: r[u] }), delete l[d], delete l[u]);
            }
          }),
            h?.visibleWhen &&
              Object.keys(h.visibleWhen).forEach(i => {
                V(i, l) || delete l[i];
              }),
            o?.(l);
        } catch (r) {
          console.error('Form validation failed:', r);
        }
      },
      G = () => {
        f.resetFields(), (O.current = {}), p?.();
      },
      D = (r, l) => {
        const { type: i, config: c = {}, placeholder: d, ...u } = r;
        let g = r.options;
        h?.optionsLinkage?.[r.field_name] && (g = K(r, l));
        const y = be(g, c);
        switch (i) {
          case 'input':
            return e.jsx(k, { placeholder: d, ...u.props });
          case 'textarea':
            return e.jsx(ge, { placeholder: d, ...u.props });
          case 'passport':
            return e.jsx(ye, { placeholder: d, ...u.props });
          case 'number':
            return e.jsx(R, { placeholder: d, style: { width: '100%' }, ...u.props });
          case 'number_range': {
            const x = r.field_name,
              j = `${x}_min`,
              w = `${x}_max`;
            return e.jsxs(S, {
              gutter: 8,
              children: [
                e.jsx(I, {
                  span: 12,
                  children: e.jsx(b.Item, {
                    name: j,
                    noStyle: !0,
                    children: e.jsx(R, {
                      placeholder: '最小值',
                      style: { width: '100%' },
                      ...u.props,
                    }),
                  }),
                }),
                e.jsx(I, {
                  span: 12,
                  children: e.jsx(b.Item, {
                    name: w,
                    noStyle: !0,
                    children: e.jsx(R, {
                      placeholder: '最大值',
                      style: { width: '100%' },
                      ...u.props,
                    }),
                  }),
                }),
              ],
            });
          }
          case 'select':
            return e.jsx(oe, { placeholder: d, options: y, ...u.props });
          case 'radio':
            return e.jsx(E, { children: r.text || '' });
          case 'radio_group':
            return e.jsx(E.Group, {
              ...u.props,
              children: y.map(x => e.jsx(E, { value: x.value, children: x.label }, x.value)),
            });
          case 'checkbox':
            return e.jsx(M, { children: r.text || '' });
          case 'checkbox_group':
            return e.jsx(M.Group, { options: y, ...u.props });
          case 'date':
            return e.jsx(N, { placeholder: d, style: { width: '100%' }, ...u.props });
          case 'date_range':
            return e.jsx(je, { style: { width: '100%' }, ...u.props });
          case 'cascader':
            return e.jsx(ie, { placeholder: d, options: y, ...u.props });
          case 'color':
            return e.jsx(k, {
              type: 'color',
              placeholder: d,
              style: { padding: '4px 8px', height: 36 },
              ...u.props,
            });
          case 'ip':
          case 'port':
          case 'hex':
            return e.jsx(k, { placeholder: d, ...u.props });
          default:
            return e.jsx(k, { placeholder: d, ...u.props });
        }
      },
      W = (r, l) => {
        const {
          field_name: i,
          label: c,
          type: d,
          required: u = !1,
          placeholder: g,
          rules: y,
          span: x = 24,
          defaultValue: j,
        } = r;
        if (!V(i, l)) return null;
        if (d === 'number_range') {
          const B = `${i}_min`,
            $ = `${i}_max`,
            Q = F[B] ?? j?.min,
            Y = F[$] ?? j?.max,
            ee = { labelCol: { span: a.label }, wrapperCol: { span: a.wrapper } };
          return e.jsxs(
            I,
            {
              span: x,
              children: [
                e.jsx(b.Item, { label: c, required: u, ...ee, children: D(r, l) }),
                e.jsx(b.Item, {
                  name: B,
                  initialValue: Q,
                  noStyle: !0,
                  hidden: !0,
                  children: e.jsx('input', { type: 'hidden' }),
                }),
                e.jsx(b.Item, {
                  name: $,
                  initialValue: Y,
                  noStyle: !0,
                  hidden: !0,
                  children: e.jsx('input', { type: 'hidden' }),
                }),
              ],
            },
            i
          );
        }
        const w = pe(d, u),
          X = he(w, y),
          U = g || me(d, c),
          Z = F[i] ?? j,
          J = { labelCol: { span: a.label }, wrapperCol: { span: a.wrapper } };
        return e.jsx(
          I,
          {
            span: x,
            children: e.jsx(b.Item, {
              name: i,
              label: c,
              rules: X,
              initialValue: Z,
              valuePropName: d === 'checkbox' || d === 'switch' ? 'checked' : 'value',
              ...J,
              children: D({ ...r, placeholder: U }, l),
            }),
          },
          i
        );
      };
    return e.jsxs(b, {
      form: f,
      layout: 'horizontal',
      onValuesChange: z,
      children: [
        e.jsx(b.Item, {
          shouldUpdate: !0,
          noStyle: !0,
          children: ({ getFieldsValue: r }) => {
            const l = r();
            return e.jsx(S, { gutter: 16, children: P.map(i => W(i, l)) });
          },
        }),
        (o || p) &&
          e.jsx(S, {
            children: e.jsxs(I, {
              span: 24,
              style: { textAlign: 'center', marginTop: 16 },
              children: [
                o &&
                  e.jsx(A, {
                    type: 'primary',
                    onClick: H,
                    style: { marginRight: 8 },
                    children: '提交',
                  }),
                p && e.jsx(A, { onClick: G, children: '重置' }),
              ],
            }),
          }),
      ],
    });
  });
q.displayName = 'FormSubmit';
function C(t, n, s) {
  return (
    (n = Fe(n)) in t
      ? Object.defineProperty(t, n, { value: s, enumerable: !0, configurable: !0, writable: !0 })
      : (t[n] = s),
    t
  );
}
function Fe(t) {
  var n = Ie(t, 'string');
  return typeof n == 'symbol' ? n : n + '';
}
function Ie(t, n) {
  if (typeof t != 'object' || !t) return t;
  var s = t[Symbol.toPrimitive];
  if (s !== void 0) {
    var a = s.call(t, n);
    if (typeof a != 'object') return a;
    throw new TypeError('@@toPrimitive must return a primitive value.');
  }
  return (n === 'string' ? String : Number)(t);
}
class Ve extends m.PureComponent {
  constructor(n) {
    super(n),
      C(this, 'getCurrentFormConfig', () => {
        const { customFormConfig: s } = this.state;
        if (s && s.length > 0) {
          const a = re(s);
          return console.log(a, 'result'), { formItems: a.items, linkageConfig: a.linkageConfig };
        }
        return { formItems: [], linkageConfig: { visibleWhen: {}, optionsLinkage: {} } };
      }),
      C(this, 'handleCustomFormUpdate', s => {
        this.setState({ customFormConfig: s });
      }),
      C(this, 'getColumns', () => [
        { title: 'ID', dataIndex: 'id', width: 60 },
        { title: '设备名称', dataIndex: 'name', width: 120 },
        {
          title: '设备类型',
          dataIndex: 'type',
          width: 100,
          render: a => ({ server: '服务器', network: '网络设备', terminal: '终端' }[a] || a),
        },
        { title: 'IP 地址', dataIndex: 'ip', width: 140 },
        { title: '端口', dataIndex: 'port', width: 80 },
        { title: '省份', dataIndex: 'province', width: 80 },
        { title: '城市', dataIndex: 'city', width: 80 },
        { title: '区县', dataIndex: 'district', width: 80 },
        {
          title: '状态',
          dataIndex: 'status',
          width: 80,
          render: a => ({ online: '在线', offline: '离线', maintain: '维护中' }[a] || a),
        },
        {
          title: '标识颜色',
          dataIndex: 'color',
          width: 80,
          render: a =>
            a
              ? e.jsxs('span', {
                  children: [
                    e.jsx('span', {
                      style: {
                        display: 'inline-block',
                        width: 12,
                        height: 12,
                        backgroundColor: a,
                        marginRight: 6,
                        verticalAlign: 'middle',
                      },
                    }),
                    a,
                  ],
                })
              : '-',
        },
        { title: '启用', dataIndex: 'enabled', width: 60, render: a => (a ? '是' : '否') },
        { title: '备注', dataIndex: 'desc', width: 150, ellipsis: !0 },
        {
          title: '操作',
          dataIndex: 'oper',
          width: 120,
          fixed: 'right',
          is_disabled: !0,
          render: (a, o) =>
            e.jsxs('span', {
              children: [
                e.jsx('a', { onClick: () => this.handleEdit(o), children: '编辑' }),
                ' | ',
                e.jsx(le, {
                  title: '确定删除？',
                  onConfirm: () => this.handleDelete(o.id),
                  children: e.jsx('a', { style: { color: '#ff4d4f' }, children: '删除' }),
                }),
              ],
            }),
        },
      ]),
      C(this, 'handleAdd', () => {
        this.setState({ modalVisible: !0, editRecord: null });
      }),
      C(this, 'handleEdit', s => {
        this.setState({ modalVisible: !0, editRecord: s });
      }),
      C(this, 'handleDelete', s => {
        this.setState(
          a => ({ dataSource: a.dataSource.filter(o => o.id !== s) }),
          () => {
            _.success('删除成功');
          }
        );
      }),
      C(this, 'handleFormSubmit', s => {
        const { editRecord: a } = this.state;
        a
          ? this.setState(
              o => ({
                dataSource: o.dataSource.map(p => (p.id === a.id ? { ...p, ...s } : p)),
                modalVisible: !1,
                editRecord: null,
              }),
              () => {
                _.success('编辑成功');
              }
            )
          : this.setState(
              o => ({
                dataSource: [...o.dataSource, { id: o.nextId, ...s }],
                nextId: o.nextId + 1,
                modalVisible: !1,
              }),
              () => {
                _.success('新增成功');
              }
            );
      }),
      (this.state = {
        dataSource: [],
        modalVisible: !1,
        editRecord: null,
        nextId: 1,
        customFormConfig: [],
      }),
      (this.formRef = m.createRef()),
      (this.editHeaderRef = m.createRef());
  }
  render() {
    const { dataSource: n, modalVisible: s, editRecord: a, customFormConfig: o } = this.state,
      { formItems: p, linkageConfig: F } = this.getCurrentFormConfig();
    return e.jsxs(m.Fragment, {
      children: [
        e.jsx(ne, {
          title: 'FormSubmit 组件演示',
          extra: e.jsxs('span', {
            children: [
              e.jsx(ae, {
                ref: this.editHeaderRef,
                title: '配置表单字段',
                type: 'form_demo_config',
                columnsType: 'formItem',
                updateHeaders: this.handleCustomFormUpdate,
              }),
              ' ',
              e.jsx(A, { type: 'primary', onClick: this.handleAdd, children: '新增设备' }),
            ],
          }),
          children: e.jsx(se, {
            height: 500,
            tableKey: 'form_demo',
            columns: this.getColumns(),
            data: n,
            pagination: !0,
            pageSize: 20,
          }),
        }),
        e.jsx(te, {
          title: a ? '编辑设备' : '新增设备',
          open: s,
          onCancel: () => this.setState({ modalVisible: !1, editRecord: null }),
          footer: null,
          width: 760,
          destroyOnClose: !0,
          children:
            o.length > 0
              ? e.jsx(q, {
                  ref: this.formRef,
                  items: p,
                  formItemLayout: { label: 6, wrapper: 18 },
                  linkageConfig: F,
                  onSubmit: this.handleFormSubmit,
                  onReset: () => {},
                  values: a || {},
                })
              : e.jsx('div', {
                  style: { textAlign: 'center', padding: 40, color: '#999' },
                  children: '请先配置表单字段',
                }),
        }),
      ],
    });
  }
}
export { Ve as default };
