import React, { useRef } from 'react';
import _ from 'lodash';
import { Table } from 'antd';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import StandardTable from 'components/newStandardTable';
import classNames from 'classnames';
import styles from './index.less';


/**
 * 通过onRowMove这个回调 传回拖拽后的list 使用这个list替换你的data.list即可
 */
export default class DragableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  DraggableBodyRow = (row) => {
    const { index, moveRow, className, style, children, ...otherProps } = row;
    const [{isOver, dropClassName}, drop] = useDrop({
      accept: 'DraggableBodyRow',
      collect: (monitor) => {
        const { dragIndex } = monitor.getItem() || {};
        if (dragIndex === index) {
          return {};
        }
        return {
          isOver: monitor.isOver(),
          dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
        }
      },
      drop: (item) => {
        if (item.index || String(item.index) === '0') {
          moveRow(item.index, index);
        }
      },
    })
    const [, drag] = useDrag({
      type: 'DraggableBodyRow',
      item: {index},
      collect: (monitor) => {
        return {isDragging: monitor.isDragging()};
      },
    })
    const ref = useRef()
    drop(drag(ref))
    return (
      <tr
        ref={ref}
        className={`${className}${isOver ? dropClassName : ''}`}
        style={{cursor: 'move', ...style}}
        {...otherProps}
      >
        {children}
      </tr>
    )
  }

  components = {
    body: {
      row: this.DraggableBodyRow,
    },
  }

  moveRow = (dragIndex, hoverIndex) => {
    const { defaultData, onRowMove } = this.props;
    const dragRow = defaultData[dragIndex];
    const newData = update(defaultData, {$splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]]});

    if (onRowMove) {
      onRowMove(newData);
    }
  }

  render() {
    const { className, ...rest } = this.props;
    const classNameExtend = styles.dragTable + (className ? " " + className : "");

    return (
      <DndProvider backend={HTML5Backend}>
        <StandardTable
          components={this.components}
          moveRow={this.moveRow}
          className={classNames(classNameExtend, 'dragTableTheme')}
          {...rest}
        />
      </DndProvider>
    )
  }
}
