(function (bmgl) {
    let config = {
        color: bmgl.Color.BLUE.withAlpha(0.4),
    };
    let draw = {
        event_end: 'bm_draw_end',
        current: null,
        dom: document.createElement('div'),
    };
    let viewer;

    function BMDraw(v, options) {
        viewer = v;
        config = Object.assign({}, config, options);
    }

    BMDraw.prototype.enable = function (type) {
        if (draw.current) {
            draw.current.disable();
            draw.current = null;
        }
        switch (type) {
            case 'marker':
                draw.current = new DrawMarker();
                break;
            case  'polyline':
                draw.current = new DrawPolyline();
                break;
            case  'polygon':
                draw.current = new DrawPolygon();
                break;
            case  'circle':
                draw.current = new DrawCircle();
                break;
            case 'rectangle':
                draw.current = new DrawRectangle();
                break;
            case 'measure':
                draw.current = new DrawMeasure();
                break;
            case 'ruler':
                draw.current = new DrawRuler();
                break;
            case 'straightArrow':
                draw.current = new DrawStraightArrow();
                break;
            case 'pinchArrow':
                draw.current = new DrawPinchArrow();
                break;
            case 'tailedAttackArrow':
                draw.current = new DrawTailedAttackArrow();
                break;
            case 'bezierLine':
                draw.current=new DrawBezierLine();
                break;
            case 'diagonalArrow':
                draw.current=new DrawDiagonalArrow();
                break;
            case 'swallowtailArrow':
                draw.current=new DrawSwallowtailArrow();
                break;
            default:
                throw 'unknown type';
        }
        viewer.container.style.cursor = 'pointer';
    }

    BMDraw.prototype.edit = function (entity, data) {
        if (draw.current) {
            draw.current.disable();
            draw.current = null;
        }
        switch (data.type) {
            case 'polyline':
                draw.current=new Editpolyline(entity,data.path);
                break;
            case 'straightArrow':
                draw.current=new EditStraightArrow(entity,data.path);
                break;
            case 'pinchArrow':
                draw.current=new EditPinchArrow(entity,data.path);
                break;
            case 'tailedAttackArrow':
                draw.current=new EditTailedAttackArrow(entity,data.path);
                break;
            // case 'diagonalArrow':
            //     draw.current=new EditDiagonalArrow(entity,data.path);
            //     break;
            default:
                throw 'unknown type';
        }
    }
    BMDraw.prototype.on = function (type, fn) {
        draw.dom.addEventListener(type, fn.bind(this));
        return this;
    }

    BMDraw.prototype.disable = function () {
        if (!draw.current) return;
        draw.current.disable();
        draw.current = null;
    }

    function DrawBezierLine() {
        this.path = [];
        this.config = {
            currentPosition: '',
            prevPosition: '',
            currentHash: '',
            prevHash: '',
            done: '',
        };
        this.handler = this.initHandler();
    }

    DrawBezierLine.prototype.initHandler = function () {
        let handler = new bmgl.ScreenSpaceEventHandler(viewer.canvas);
        handler.setInputAction(movement => {
            this.config.currentHash = Math.floor(movement.position.x) + '_' + Math.floor(movement.position.y);
            if (this.config.currentHash === this.config.prevHash) return;
            this.config.prevHash = this.config.currentHash;
            let p = getCurrentPosition(movement.position);
            if (!p) return;
            p.x=movement.position.x;
            p.y=movement.position.y;
            this.path.push(p);
            !this.config.prevPosition && (this.config.prevPosition = p);
        }, bmgl.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction(movement => {
            let p = getCurrentPosition(movement.endPosition);
            if (p){
                p.x=movement.endPosition.x;
                p.y=movement.endPosition.y;
            this.config.currentPosition = p;
            }
        }, bmgl.ScreenSpaceEventType.MOUSE_MOVE);

        this.config.done = viewer.entities.add({
            polyline: Object.assign({material: config.color}, config.bezierLine),
            polygon:{
                material:new bmgl.ImageMaterialProperty({
                    image:'url.png',
                    transparent:true,
                })
            }
        });

        this.config.done.polyline.positions = new bmgl.CallbackProperty(() => {
            if (this.path.length > 1 && this.path[0].lng !== this.config.currentPosition.lng) {
                let p = _createGeoPoints(viewer, _createBezierPoints([...this.path,this.config.currentPosition]));
                return  bmgl.Cartesian3.fromDegreesArray(p);
            } else {
                return bmgl.Cartesian3.fromDegreesArray([]);
            }
        });

        handler.setInputAction(movement => {
            this.disable();
        }, bmgl.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        return handler;
    }

    DrawBezierLine.prototype.disable = function () {
        viewer.container.style.cursor = '';
        this.handler.destroy();
        draw.current = null;
        viewer.entities.remove(this.config.draft);
        if (this.path.length >= 1) {
            this.config.done.polyline.positions=this.config.done.polyline.positions.getValue();
            draw.dom.dispatchEvent(new CustomEvent('bm_draw_end', {
                detail: {
                    type: 'bezierLine',
                    entity: this.config.done,
                    path: this.path,
                }
            }));
        }else{
            viewer.entities.remove(this.config.done);
        }
    }
    function EditTailedAttackArrow(entity,path) {
        this.path = path;
        this.config = {
            currentPosition: '',
            prevPosition: '',
            currentHash: '',
            prevHash: '',
            done: entity,
            markers:[],
            ids:[],
            index:null,
        };
        this.handler = this.initHandler();
    }

    EditTailedAttackArrow.prototype.initHandler = function () {
        let handler = new bmgl.ScreenSpaceEventHandler(viewer.canvas);
        let tmp_id=new Date().getTime();
        this.path.map(v => {
            this.config.markers.push(
                viewer.entities.add({
                    id: tmp_id.toString(),
                    position: bmgl.Cartesian3.fromDegrees(v.lng, v.lat),
                    billboard: new bmgl.BillboardGraphics({
                        heightReference: bmgl.HeightReference.CLAMP_TO_GROUND,
                        image: '/bmgl/js/draw/img/dragIcon.png',
                    })
                })
            );
            this.config.ids.push(tmp_id.toString());
            tmp_id++;
        });

        handler.setInputAction( (e)=> {
            var entity =viewer.scene.pick(e.position);
            if (!entity) return;
            var id = entity.id && entity.id.id;
            this.config.index = this.config.ids.indexOf(id);
            if ( this.config.index === -1) return;
            this.config.markers[this.config.index].position = new bmgl.CallbackProperty(()=>{
                this.path[this.config.index]=this.config.currentPosition;
                return this.config.currentPosition.origin;
            }, false);
            viewer.scene.screenSpaceCameraController.enableRotate = false;
        }, bmgl.ScreenSpaceEventType.LEFT_DOWN);

        handler.setInputAction(e=> {
            viewer.scene.screenSpaceCameraController.enableRotate = true;
            this.config.markers[this.config.index]&&(this.config.markers[this.config.index].position = this.config.markers[this.config.index].position.getValue());
        }, bmgl.ScreenSpaceEventType.LEFT_UP);

        handler.setInputAction(movement => {
            let p = getCurrentPosition(movement.endPosition);
            p && (this.config.currentPosition = p);
        }, bmgl.ScreenSpaceEventType.MOUSE_MOVE);
        this.config.done.polygon.hierarchy=new bmgl.CallbackProperty( ()=>{
            return new bmgl.PolygonHierarchy(xp.algorithm.tailedAttackArrow(this.path.map(v=>[v.lng,v.lat])).polygonalPoint)
        },false);

        handler.setInputAction(movement => {
            this.disable();
        }, bmgl.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        return handler;
    }

    EditTailedAttackArrow.prototype.disable = function () {
        this.config.done.polygon.hierarchy=this.config.done.polygon.hierarchy.getValue();
        this.config.markers.map(v=>viewer.entities.remove(v));
        this.config.done._bige_edit=false;
        viewer.container.style.cursor = '';
        this.handler.destroy();
        draw.current = null;
        draw.dom.dispatchEvent(new CustomEvent('bm_edit_end', {
            detail: {
                type: 'pinchArrow',
                entity: this.config.done,
                path: this.path,
            }
        }));

    }
    function EditPinchArrow(entity,path) {
        this.path = path;
        this.config = {
            currentPosition: '',
            prevPosition: '',
            currentHash: '',
            prevHash: '',
            done: entity,
            markers:[],
            ids:[],
            index:null,
        };
        this.handler = this.initHandler();
    }

    EditPinchArrow.prototype.initHandler = function () {
        let handler = new bmgl.ScreenSpaceEventHandler(viewer.canvas);
        let tmp_id=new Date().getTime();
        this.path.map(v => {
            this.config.markers.push(
                viewer.entities.add({
                    id: tmp_id.toString(),
                    position: bmgl.Cartesian3.fromDegrees(v.lng, v.lat),
                    billboard: new bmgl.BillboardGraphics({
                        heightReference: bmgl.HeightReference.CLAMP_TO_GROUND,
                        image: '/bmgl/js/draw/img/dragIcon.png',
                    })
                })
            );
            this.config.ids.push(tmp_id.toString());
            tmp_id++;
        });

        handler.setInputAction( (e)=> {
            var entity =viewer.scene.pick(e.position);
            if (!entity) return;
            var id = entity.id && entity.id.id;
            this.config.index = this.config.ids.indexOf(id);
            if ( this.config.index === -1) return;
            this.config.markers[this.config.index].position = new bmgl.CallbackProperty(()=>{
                this.path[this.config.index]=this.config.currentPosition;
                return this.config.currentPosition.origin;
            }, false);
            viewer.scene.screenSpaceCameraController.enableRotate = false;
        }, bmgl.ScreenSpaceEventType.LEFT_DOWN);

        handler.setInputAction(e=> {
            viewer.scene.screenSpaceCameraController.enableRotate = true;
            this.config.markers[this.config.index]&&(this.config.markers[this.config.index].position = this.config.markers[this.config.index].position.getValue());
        }, bmgl.ScreenSpaceEventType.LEFT_UP);

        handler.setInputAction(movement => {
            let p = getCurrentPosition(movement.endPosition);
            p && (this.config.currentPosition = p);
        }, bmgl.ScreenSpaceEventType.MOUSE_MOVE);
        this.config.done.polygon.hierarchy=new bmgl.CallbackProperty( ()=>{
            return new bmgl.PolygonHierarchy(xp.algorithm.doubleArrow(this.path.slice(0,4).map(v=>[v.lng,v.lat])).polygonalPoint);
        },false);

        handler.setInputAction(movement => {
            this.disable();
        }, bmgl.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        return handler;
    }

    EditPinchArrow.prototype.disable = function () {
        this.config.done.polygon.hierarchy=this.config.done.polygon.hierarchy.getValue();
        this.config.markers.map(v=>viewer.entities.remove(v));
        this.config.done._bige_edit=false;
        viewer.container.style.cursor = '';
        this.handler.destroy();
        draw.current = null;
        draw.dom.dispatchEvent(new CustomEvent('bm_edit_end', {
            detail: {
                type: 'pinchArrow',
                entity: this.config.done,
                path: this.path,
            }
        }));
    }
    function Editpolyline(entity,path) {
        this.path = path;
        this.config = {
            currentPosition: '',
            prevPosition: '',
            currentHash: '',
            prevHash: '',
            done: entity,
            draft: ''
        };
        this.handler = this.initHandler();
    }

    Editpolyline.prototype.initHandler = function () {
        let handler = new bmgl.ScreenSpaceEventHandler(viewer.canvas);
        handler.setInputAction(movement => {
            this.config.currentHash = Math.floor(movement.position.x) + '_' + Math.floor(movement.position.y);
            if (this.config.currentHash === this.config.prevHash) return;
            this.config.prevHash = this.config.currentHash;
            let p = getCurrentPosition(movement.position);
            if (!p) return;
            this.config.prevPosition = p;
            this.path.push(p);
        }, bmgl.ScreenSpaceEventType.LEFT_CLICK);
        handler.setInputAction(movement => {
            let p = getCurrentPosition(movement.endPosition);
            p && (this.config.currentPosition = p);
        }, bmgl.ScreenSpaceEventType.MOUSE_MOVE);
        this.config.done = viewer.entities.add({
            polyline: Object.assign({},{material: config.color}, config.polyline),
        });
        this.config.done.polyline.positions = new bmgl.CallbackProperty(() => {
            return this.path.length >= 2 ? this.path.map(v => v.origin) : bmgl.Cartesian3.fromDegreesArray([]);
        });
        this.config.draft = viewer.entities.add({
            polyline: this.config.done.polyline.clone(),
        });
        this.config.draft.polyline.material = new bmgl.PolylineDashMaterialProperty({
            color: config.polyline && config.polyline.color || config.color,
        });
        this.config.draft.polyline.positions = new bmgl.CallbackProperty(() => {
            return this.config.prevPosition && this.config.currentPosition ? [this.config.prevPosition.origin, this.config.currentPosition.origin] : bmgl.Cartesian3.fromDegreesArray([]);
        });
        handler.setInputAction(movement => {
            this.disable();
        }, bmgl.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        return handler;
    }

    Editpolyline.prototype.disable = function () {
        viewer.container.style.cursor = '';
        this.handler.destroy();
        draw.current = null;
        viewer.entities.remove(this.config.draft);
        if (this.path.length >= 2) {
            draw.dom.dispatchEvent(new CustomEvent('bm_draw_end', {
                detail: {
                    type: 'polyline',
                    entity: this.config.done,
                    path: this.path,
                }
            }));
        }

    }
    
    function EditStraightArrow(entity,path) {
        this.path = path;
        this.config = {
            currentPosition: '',
            prevPosition: '',
            currentHash: '',
            prevHash: '',
            done: entity,
            markers:[],
            ids:[],
            index:null,
        };
        this.handler = this.initHandler();
    }

    EditStraightArrow.prototype.initHandler = function () {
        let handler = new bmgl.ScreenSpaceEventHandler(viewer.canvas);
        let tmp_id=new Date().getTime();
        this.path.map(v => {
            this.config.markers.push(
                viewer.entities.add({
                    id: tmp_id.toString(),
                    position: bmgl.Cartesian3.fromDegrees(v.lng, v.lat),
                    billboard: new bmgl.BillboardGraphics({
                        heightReference: bmgl.HeightReference.CLAMP_TO_GROUND,
                        image: '/bmgl/js/draw/img/dragIcon.png',
                    })
                })
            );
            this.config.ids.push(tmp_id.toString());
            tmp_id++;
        });

        handler.setInputAction( (e)=> {
            var entity =viewer.scene.pick(e.position);
            if (!entity) return;
            var id = entity.id && entity.id.id;
            this.config.index = this.config.ids.indexOf(id);
            if ( this.config.index === -1) return;
            this.config.markers[this.config.index].position = new bmgl.CallbackProperty(()=>{
                this.path[this.config.index]=this.config.currentPosition;
                return this.config.currentPosition.origin;
            }, false);
            viewer.scene.screenSpaceCameraController.enableRotate = false;
        }, bmgl.ScreenSpaceEventType.LEFT_DOWN);

        handler.setInputAction(e=> {
            viewer.scene.screenSpaceCameraController.enableRotate = true;
            this.config.markers[this.config.index]&&(this.config.markers[this.config.index].position = this.config.markers[this.config.index].position.getValue());
        }, bmgl.ScreenSpaceEventType.LEFT_UP);

        handler.setInputAction(movement => {
            let p = getCurrentPosition(movement.endPosition);
            p && (this.config.currentPosition = p);
        }, bmgl.ScreenSpaceEventType.MOUSE_MOVE);
        this.config.done.polygon.hierarchy=new bmgl.CallbackProperty( ()=>{
            return new bmgl.PolygonHierarchy(xp.algorithm.fineArrow([this.path[0]['lng'], this.path[0]['lat']], [this.path[1]['lng'], this.path[1]['lat']]));
        },false);

        handler.setInputAction(movement => {
            this.disable();
        }, bmgl.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        return handler;
    }

    EditStraightArrow.prototype.disable = function () {
        this.config.done.polygon.hierarchy=this.config.done.polygon.hierarchy.getValue();
        this.config.markers.map(v=>viewer.entities.remove(v));
        this.config.done._bige_edit=false;
        viewer.container.style.cursor = '';
        this.handler.destroy();
        draw.current = null;
        draw.dom.dispatchEvent(new CustomEvent('bm_edit_end', {
            detail: {
                type: 'straightArrow',
                entity: this.config.done,
                path: this.path,
            }
        }));
    }

    function EditDiagonalArrow(entity,path) {
        this.path = path;
        this.config = {
            currentPosition: '',
            prevPosition: '',
            currentHash: '',
            prevHash: '',
            done: entity,
            markers:[],
            ids:[],
            index:null,
        };
        this.handler = this.initHandler();
    }

    EditDiagonalArrow.prototype.initHandler = function () {
        let handler = new bmgl.ScreenSpaceEventHandler(viewer.canvas);
        let tmp_id=new Date().getTime();
        this.path.map(v => {
            this.config.markers.push(
                viewer.entities.add({
                    id: tmp_id.toString(),
                    position: bmgl.Cartesian3.fromDegrees(v.lng, v.lat),
                    billboard: new bmgl.BillboardGraphics({
                        heightReference: bmgl.HeightReference.CLAMP_TO_GROUND,
                        image: '/bmgl/js/draw/img/dragIcon.png',
                    })
                })
            );
            this.config.ids.push(tmp_id.toString());
            tmp_id++;
        });

        handler.setInputAction( (e)=> {
            var entity =viewer.scene.pick(e.position);
            if (!entity) return;
            var id = entity.id && entity.id.id;
            this.config.index = this.config.ids.indexOf(id);
            if ( this.config.index === -1) return;
            this.config.markers[this.config.index].position = new bmgl.CallbackProperty(()=>{
                this.path[this.config.index]=this.config.currentPosition;
                return this.config.currentPosition.origin;
            }, false);
            viewer.scene.screenSpaceCameraController.enableRotate = false;
        }, bmgl.ScreenSpaceEventType.LEFT_DOWN);

        handler.setInputAction(e=> {
            viewer.scene.screenSpaceCameraController.enableRotate = true;
            this.config.markers[this.config.index]&&(this.config.markers[this.config.index].position = this.config.markers[this.config.index].position.getValue());
        }, bmgl.ScreenSpaceEventType.LEFT_UP);

        handler.setInputAction(movement => {
            let p = getCurrentPosition(movement.endPosition);
            p && (this.config.currentPosition = p);
        }, bmgl.ScreenSpaceEventType.MOUSE_MOVE);
        this.config.done.polygon.hierarchy=new bmgl.CallbackProperty( ()=>{
            let p = _createGeoPoints(viewer, _computeDiagonalArrow(this.path));
            return new bmgl.PolygonHierarchy(bmgl.Cartesian3.fromDegreesArray(p));
        },false);

        handler.setInputAction(movement => {
            this.disable();
        }, bmgl.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        return handler;
    }

    EditDiagonalArrow.prototype.disable = function () {
        this.config.done.polygon.hierarchy=this.config.done.polygon.hierarchy.getValue();
        this.config.markers.map(v=>viewer.entities.remove(v));
        this.config.done._bige_edit=false;
        viewer.container.style.cursor = '';
        this.handler.destroy();
        draw.current = null;
        draw.dom.dispatchEvent(new CustomEvent('bm_edit_end', {
            detail: {
                type: 'straightArrow',
                entity: this.config.done,
                path: this.path,
            }
        }));
    }

    function DrawRectangle() {
        this.path = [];
        this.config = {
            currentPosition: '',
            prevPosition: '',
            currentHash: '',
            prevHash: '',
            done: '',
            draft: ''
        };
        this.handler = this.initHandler();
    }

    DrawRectangle.prototype.initHandler = function () {
        let handler = new bmgl.ScreenSpaceEventHandler(viewer.canvas);
        handler.setInputAction(movement => {
            this.config.currentHash = Math.floor(movement.position.x) + '_' + Math.floor(movement.position.y);
            if (this.config.currentHash === this.config.prevHash) return;
            this.config.prevHash = this.config.currentHash;
            let p = getCurrentPosition(movement.position);
            if (!p) return;
            this.path.push(p);
            if (this.path.length >= 2) {
                this.disable();
                return;
            }
            this.config.prevPosition = p;
        }, bmgl.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction(movement => {
            let p = getCurrentPosition(movement.endPosition);
            p && (this.config.currentPosition = p);
        }, bmgl.ScreenSpaceEventType.MOUSE_MOVE);
        let callback = () => {
            if (this.config.prevPosition) {
                var p = [this.config.prevPosition.lng, this.config.prevPosition.lat, this.config.currentPosition.lng, this.config.currentPosition.lat],
                    tmp;
                p[0] > p[2] ? (tmp = p[0], p[0] = p[2], p[2] = tmp) : true;
                p[1] > p[3] ? (tmp = p[1], p[1] = p[3], p[3] = tmp) : true;
                return bmgl.Rectangle.fromDegrees(p[0], p[1], p[2], p[3]);
            } else {
                return bmgl.Rectangle.fromDegrees([0, 0, 0, 0]);
            }
        };

        this.config.done = viewer.entities.add({
            rectangle: Object.assign({material: config.color}, config.rectangle),
        });

        this.config.done.rectangle.coordinates = new bmgl.CallbackProperty(callback, false);

        handler.setInputAction(movement => {
            this.disable();
        }, bmgl.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        return handler;
    }

    DrawRectangle.prototype.disable = function () {
        viewer.container.style.cursor = '';
        this.handler.destroy();
        draw.current = null;
        viewer.entities.remove(this.config.draft);
        if (this.path.length >= 2) {
            // this.config.done.ellipse.semiMajorAxis=this.config.done.ellipse.semiMajorAxis.getValue();
            // this.config.done.ellipse.semiMinorAxis=this.config.done.ellipse.semiMinorAxis.getValue();
            var v = this.config.done.rectangle.coordinates.getValue();
            // this.config.done.rectangle.coordinates=v;
            var t = [v.west, v.south, v.east, v.north].map(v => bmgl.Math.toDegrees(v));
            draw.dom.dispatchEvent(new CustomEvent('bm_draw_end', {
                detail: {
                    type: 'rectangle',
                    entity: this.config.done,
                    path: t,
                }
            }));
        }
    }

    function DrawTailedAttackArrow() {
        this.path = [];
        this.config = {
            currentPosition: '',
            prevPosition: '',
            currentHash: '',
            prevHash: '',
            done: '',
            draft: ''
        };
        this.handler = this.initHandler();
    }

    DrawTailedAttackArrow.prototype.initHandler = function () {
        let handler = new bmgl.ScreenSpaceEventHandler(viewer.canvas);
        handler.setInputAction(movement => {
            this.config.currentHash = Math.floor(movement.position.x) + '_' + Math.floor(movement.position.y);
            if (this.config.currentHash === this.config.prevHash) return;
            this.config.prevHash = this.config.currentHash;
            let p = getCurrentPosition(movement.position);
            if (!p) return;
            this.path.push(p);
            !this.config.prevPosition && (this.config.prevPosition = p);
        }, bmgl.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction(movement => {
            let p = getCurrentPosition(movement.endPosition);
            p && (this.config.currentPosition = p);
        }, bmgl.ScreenSpaceEventType.MOUSE_MOVE);
        this.config.done = viewer.entities.add({
            polygon: Object.assign({material: config.color}, config.tailedAttackArrow),
        });

        this.config.done.polygon.hierarchy = new bmgl.CallbackProperty(() => {
            if (this.path.length >= 2) {
                let new_path = this.path.map(v => [v.lng, v.lat]);
                new_path.push([this.config.currentPosition.lng, this.config.currentPosition.lat]);
                return new bmgl.PolygonHierarchy(xp.algorithm.tailedAttackArrow(new_path).polygonalPoint);
            } else {
                return new bmgl.PolygonHierarchy([]);
            }
        });

        handler.setInputAction(movement => {
            this.disable();
        }, bmgl.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        return handler;
    }

    DrawTailedAttackArrow.prototype.disable = function () {
        viewer.container.style.cursor = '';
        this.handler.destroy();
        draw.current = null;
        viewer.entities.remove(this.config.draft);
        if (this.path.length >= 1) {
            draw.dom.dispatchEvent(new CustomEvent('bm_draw_end', {
                detail: {
                    type: 'tailedAttackArrow',
                    entity: this.config.done,
                    path: this.path,
                }
            }));
        }

    }

    function DrawPinchArrow() {
        this.path = [];
        this.config = {
            draw: true,
            currentPosition: '',
            prevPosition: '',
            currentHash: '',
            prevHash: '',
            done: '',
            draft: ''
        };
        this.handler = this.initHandler();
    }

    DrawPinchArrow.prototype.initHandler = function () {
        let handler = new bmgl.ScreenSpaceEventHandler(viewer.canvas);
        handler.setInputAction(movement => {
            this.config.currentHash = Math.floor(movement.position.x) + '_' + Math.floor(movement.position.y);
            if (this.config.currentHash === this.config.prevHash) return;
            this.config.prevHash = this.config.currentHash;
            let p = getCurrentPosition(movement.position);
            if (!p) return;
            this.path.push(p);
            !this.config.prevPosition && (this.config.prevPosition = p);
        }, bmgl.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction(movement => {
            let p = getCurrentPosition(movement.endPosition);
            p && (this.config.currentPosition = p);
        }, bmgl.ScreenSpaceEventType.MOUSE_MOVE);
        this.config.done = viewer.entities.add({
            polygon: Object.assign({material: config.color}, config.pinchArrow),
        });

        this.config.done.polygon.hierarchy = new bmgl.CallbackProperty(() => {
            if (this.path.length >= 2) {
                try {
                    if (this.path.length === 2) {
                        return this.path[1].lng !== this.config.currentPosition.lng ? new bmgl.PolygonHierarchy(xp.algorithm.doubleArrow([[this.path[0].lng, this.path[0].lat], [this.path[1].lng, this.path[1].lat], [this.config.currentPosition.lng, this.config.currentPosition.lat]]).polygonalPoint) : new bmgl.PolygonHierarchy([]);
                    } else if (this.path.length === 3) {
                        return this.config.draw ? new bmgl.PolygonHierarchy(xp.algorithm.doubleArrow([[this.path[0].lng, this.path[0].lat], [this.path[1].lng, this.path[1].lat], [this.path[2].lng, this.path[2].lat], [this.config.currentPosition.lng, this.config.currentPosition.lat]]).polygonalPoint) : new bmgl.PolygonHierarchy(xp.algorithm.doubleArrow([[this.path[0].lng, this.path[0].lat], [this.path[1].lng, this.path[1].lat], [this.path[2].lng, this.path[2].lat]]).polygonalPoint);
                    } else {
                        return new bmgl.PolygonHierarchy(xp.algorithm.doubleArrow([[this.path[0].lng, this.path[0].lat], [this.path[1].lng, this.path[1].lat], [this.path[2].lng, this.path[2].lat], [this.config.currentPosition.lng, this.config.currentPosition.lat]]).polygonalPoint);
                    }
                } catch (e) {
                    // debugger;
                }
            } else {
                return new bmgl.PolygonHierarchy([]);
            }
        });

        handler.setInputAction(movement => {
            this.disable();
            this.config.draw = false;
        }, bmgl.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        return handler;
    }

    DrawPinchArrow.prototype.disable = function () {
        viewer.container.style.cursor = '';
        this.handler.destroy();
        draw.current = null;
        viewer.entities.remove(this.config.draft);
        if (this.path.length >= 1) {
            draw.dom.dispatchEvent(new CustomEvent('bm_draw_end', {
                detail: {
                    type: 'pinchArrow',
                    entity: this.config.done,
                    path: this.path.slice(0, 4),
                }
            }));
        }
    }

    function DrawDiagonalArrow() {
        this.path = [];
        this.config = {
            currentPosition: '',
            prevPosition: '',
            currentHash: '',
            prevHash: '',
            done: '',
            draft: ''
        };
        this.handler = this.initHandler();
    }

    DrawDiagonalArrow.prototype.initHandler = function () {
        let handler = new bmgl.ScreenSpaceEventHandler(viewer.canvas);
        handler.setInputAction(movement => {
            this.config.currentHash = Math.floor(movement.position.x) + '_' + Math.floor(movement.position.y);
            if (this.config.currentHash === this.config.prevHash) return;
            this.config.prevHash = this.config.currentHash;
            let p = getCurrentPosition(movement.position);
            if (!p) return;
            this.path.push(p);
        }, bmgl.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction(movement => {
            let p = getCurrentPosition(movement.endPosition);
            p && (this.config.currentPosition = p);
        }, bmgl.ScreenSpaceEventType.MOUSE_MOVE);

        this.config.done = viewer.entities.add({
            polygon: Object.assign({material: config.color}, config.diagonalArrow),
        });

        this.config.done.polygon.hierarchy = new bmgl.CallbackProperty(() => {
            if (this.path.length >= 1 && this.path[0].lng !== this.config.currentPosition.lng) {
                let p = _createGeoPoints(viewer, _computeDiagonalArrow([this.path[0],this.config.currentPosition]));
                return new bmgl.PolygonHierarchy(bmgl.Cartesian3.fromDegreesArray(p));
            } else {
                return new bmgl.PolygonHierarchy([]);
            }
        });

        handler.setInputAction(movement => {
            this.disable();
        }, bmgl.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        return handler;
    }

    DrawDiagonalArrow.prototype.disable = function () {
        viewer.container.style.cursor = '';
        this.handler.destroy();
        draw.current = null;
        viewer.entities.remove(this.config.draft);
        if (this.path.length >= 1) {
            this.config.done.polygon.hierarchy=this.config.done.polygon.hierarchy.getValue();
            draw.dom.dispatchEvent(new CustomEvent('bm_draw_end', {
                detail: {
                    type: 'diagonalArrow',
                    entity: this.config.done,
                    path: this.path.slice(0,2),
                }
            }));
        }

    }

    function DrawSwallowtailArrow() {
        this.path = [];
        this.config = {
            currentPosition: '',
            prevPosition: '',
            currentHash: '',
            prevHash: '',
            done: '',
            draft: ''
        };
        this.handler = this.initHandler();
    }

    DrawSwallowtailArrow.prototype.initHandler = function () {
        let handler = new bmgl.ScreenSpaceEventHandler(viewer.canvas);
        handler.setInputAction(movement => {
            this.config.currentHash = Math.floor(movement.position.x) + '_' + Math.floor(movement.position.y);
            if (this.config.currentHash === this.config.prevHash) return;
            this.config.prevHash = this.config.currentHash;
            let p = getCurrentPosition(movement.position);
            if (!p) return;
            this.path.push(p);
            !this.config.prevPosition && (this.config.prevPosition = p);
        }, bmgl.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction(movement => {
            let p = getCurrentPosition(movement.endPosition);
            p && (this.config.currentPosition = p);
        }, bmgl.ScreenSpaceEventType.MOUSE_MOVE);
        this.config.done = viewer.entities.add({
            polygon: Object.assign({material: config.color}, config.swallowtailArrow),
        });

        this.config.done.polygon.hierarchy = new bmgl.CallbackProperty(() => {
            if (this.path.length >= 1 && this.path[0].lng !== this.config.currentPosition.lng) {
                let p=_createGeoPoints(viewer, _computeSwallowtailArrow([this.path[0],this.config.currentPosition]));
                return new bmgl.PolygonHierarchy(bmgl.Cartesian3.fromDegreesArray(p));
            } else {
                return new bmgl.PolygonHierarchy([]);
            }
        });
        handler.setInputAction(movement => {
            this.disable();
        }, bmgl.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        return handler;
    }

    DrawSwallowtailArrow.prototype.disable = function () {
        viewer.container.style.cursor = '';
        this.handler.destroy();
        draw.current = null;
        viewer.entities.remove(this.config.draft);
        if (this.path.length >= 1) {
            this.config.done.polygon.hierarchy=this.config.done.polygon.hierarchy.getValue();
            draw.dom.dispatchEvent(new CustomEvent('bm_draw_end', {
                detail: {
                    type: 'swallowtailArrow',
                    entity: this.config.done,
                    path: [this.path[0], this.config.currentPosition],
                }
            }));
        }

    }

    function DrawStraightArrow() {
        this.path = [];
        this.config = {
            currentPosition: '',
            prevPosition: '',
            currentHash: '',
            prevHash: '',
            done: '',
            draft: ''
        };
        this.handler = this.initHandler();
    }

    DrawStraightArrow.prototype.initHandler = function () {
        let handler = new bmgl.ScreenSpaceEventHandler(viewer.canvas);
        handler.setInputAction(movement => {
            this.config.currentHash = Math.floor(movement.position.x) + '_' + Math.floor(movement.position.y);
            if (this.config.currentHash === this.config.prevHash) return;
            this.config.prevHash = this.config.currentHash;
            let p = getCurrentPosition(movement.position);
            if (!p) return;
            this.path.push(p);
            !this.config.prevPosition && (this.config.prevPosition = p);
        }, bmgl.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction(movement => {
            let p = getCurrentPosition(movement.endPosition);
            p && (this.config.currentPosition = p);
        }, bmgl.ScreenSpaceEventType.MOUSE_MOVE);

        this.config.done = viewer.entities.add({
            polygon: Object.assign({material: config.color}, config.straightArrow),
        });
        this.config.done.polygon.hierarchy = new bmgl.CallbackProperty(() => {
            if (this.path.length >= 1 && this.path[0].lng !== this.config.currentPosition.lng) {
                return new bmgl.PolygonHierarchy(xp.algorithm.fineArrow([this.path[0].lng, this.path[0].lat], [this.config.currentPosition.lng, this.config.currentPosition.lat]));
            } else {
                return new bmgl.PolygonHierarchy([]);
            }
        });
        handler.setInputAction(movement => {
            this.disable();
        }, bmgl.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        return handler;
    }

    DrawStraightArrow.prototype.disable = function () {
        viewer.container.style.cursor = '';
        this.handler.destroy();
        draw.current = null;
        viewer.entities.remove(this.config.draft);
        if (this.path.length >= 1) {
            draw.dom.dispatchEvent(new CustomEvent('bm_draw_end', {
                detail: {
                    type: 'straightArrow',
                    entity: this.config.done,
                    path: [this.path[0], this.config.currentPosition],
                }
            }));
        }

    }

    function DrawMeasure() {
        this.path = [];
        this.config = {
            currentPosition: '',
            prevPosition: '',
            currentHash: '',
            prevHash: '',
            done: '',
            draft: ''
        };
        this.initLabel();
        this.handler = this.initHandler();
    }

    DrawMeasure.prototype.initLabel = function () {
        this.labels = new bmgl.LabelCollection();
        viewer.scene.primitives.add(this.labels);
        this.labels.add(createLabel());
    }

    DrawMeasure.prototype.initHandler = function () {
        let handler = new bmgl.ScreenSpaceEventHandler(viewer.canvas);
        handler.setInputAction(movement => {
            this.config.currentHash = Math.floor(movement.position.x) + '_' + Math.floor(movement.position.y);
            if (this.config.currentHash === this.config.prevHash) return;
            this.config.prevHash = this.config.currentHash;
            let p = getCurrentPosition(movement.position);
            if (!p) return;
            this.config.prevPosition = p;
            this.path.push(p);
        }, bmgl.ScreenSpaceEventType.LEFT_CLICK);
        handler.setInputAction(movement => {
            let p = getCurrentPosition(movement.endPosition);
            if (!p) return;
            var area;
            if (this.path.length >= 2) {
                area = getArea([...this.path, p]);
            } else {
                area = 0;
            }
            this.labels.get(0).text = getReadable(area, 'area');
            if (area) {
                try {
                    var r = bmgl.Rectangle.fromCartesianArray(this.config.done.polygon.hierarchy.getValue().positions);
                    r = bmgl.Rectangle.center(r);
                    this.labels.get(0).position = bmgl.Cartesian3.fromRadians(r.longitude, r.latitude, r.height);
                } catch (e) {
                    this.labels.get(0).position = p.origin;
                }
            }
            this.config.currentPosition = p;
        }, bmgl.ScreenSpaceEventType.MOUSE_MOVE);
        this.config.done = viewer.entities.add({
            polygon: Object.assign({material: config.color}, config.measure),
        });

        this.config.done.polygon.hierarchy = new bmgl.CallbackProperty(() => {
            if (this.path.length >= 2) {
                return new bmgl.PolygonHierarchy([...this.path.map(v => v.origin), this.config.currentPosition.origin]);
            } else {
                return new bmgl.PolygonHierarchy([]);
            }
        });

        handler.setInputAction(movement => {
            this.disable();
        }, bmgl.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        return handler;
    }

    DrawMeasure.prototype.disable = function () {
        this.config.done.polygon.hierarchy = this.config.done.polygon.hierarchy.getValue();
        viewer.container.style.cursor = '';
        this.handler.destroy();
        draw.current = null;
        viewer.entities.remove(this.config.draft);
        if (this.path.length >= 2) {
            draw.dom.dispatchEvent(new CustomEvent('bm_draw_end', {
                detail: {
                    type: 'measure',
                    label: this.labels,
                    entity: this.config.done,
                    path: this.path,
                }
            }));
        }
    }


    function DrawPolygon() {
        this.path = [];
        this.config = {
            currentPosition: '',
            prevPosition: '',
            currentHash: '',
            prevHash: '',
            done: '',
            draft: ''
        };
        this.handler = this.initHandler();
    }

    DrawPolygon.prototype.initHandler = function () {
        let handler = new bmgl.ScreenSpaceEventHandler(viewer.canvas);
        handler.setInputAction(movement => {
            this.config.currentHash = Math.floor(movement.position.x) + '_' + Math.floor(movement.position.y);
            if (this.config.currentHash === this.config.prevHash) return;
            this.config.prevHash = this.config.currentHash;
            let p = getCurrentPosition(movement.position);
            if (!p) return;
            this.config.prevPosition = p;
            this.path.push(p);
        }, bmgl.ScreenSpaceEventType.LEFT_CLICK);
        handler.setInputAction(movement => {
            let p = getCurrentPosition(movement.endPosition);
            p && (this.config.currentPosition = p);
        }, bmgl.ScreenSpaceEventType.MOUSE_MOVE);

        this.config.done = viewer.entities.add({
            polygon: Object.assign({material: config.color}, config.polygon),
        });

        this.config.done.polygon.hierarchy = new bmgl.CallbackProperty(() => {
            if (this.path.length >= 2) {
                return new bmgl.PolygonHierarchy([...this.path.map(v => v.origin), this.config.currentPosition.origin]);
            } else {
                return new bmgl.PolygonHierarchy([]);
            }
        });

        handler.setInputAction(movement => {
            this.disable();
        }, bmgl.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        return handler;
    }

    DrawPolygon.prototype.disable = function () {
        viewer.container.style.cursor = '';
        this.handler.destroy();
        draw.current = null;
        viewer.entities.remove(this.config.draft);
        if (this.path.length >= 3) {
            this.config.done.polygon.hierarchy = this.config.done.polygon.hierarchy.getValue();
            draw.dom.dispatchEvent(new CustomEvent('bm_draw_end', {
                detail: {
                    type: 'polygon',
                    entity: this.config.done,
                    path: this.path,
                }
            }));
        }
    }

    function DrawCircle() {
        this.path = [];
        this.config = {
            currentPosition: '',
            prevPosition: '',
            currentHash: '',
            prevHash: '',
            done: '',
            draft: ''
        };
        this.handler = this.initHandler();
    }

    DrawCircle.prototype.initHandler = function () {
        let handler = new bmgl.ScreenSpaceEventHandler(viewer.canvas);
        handler.setInputAction(movement => {
            this.config.currentHash = Math.floor(movement.position.x) + '_' + Math.floor(movement.position.y);
            if (this.config.currentHash === this.config.prevHash) return;
            this.config.prevHash = this.config.currentHash;
            let p = getCurrentPosition(movement.position);
            if (!p) return;
            if (!this.config.done.position) this.config.done.position = p.origin;
            this.path.push(p);
            if (this.path.length >= 2) {
                this.disable();
                return;
            }
            this.config.prevPosition = p;
        }, bmgl.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction(movement => {
            let p = getCurrentPosition(movement.endPosition);
            p && (this.config.currentPosition = p);
        }, bmgl.ScreenSpaceEventType.MOUSE_MOVE);
        let callback = () => {
            return this.config.prevPosition ? getDistance(this.config.prevPosition, this.config.currentPosition) : 0;
        };

        this.config.done = viewer.entities.add({
            ellipse: Object.assign({},{material:config.color},config.ellipse,{semiMajorAxis:new bmgl.CallbackProperty(callback, false),semiMinorAxis: new bmgl.CallbackProperty(callback, false)}),
        });

        handler.setInputAction(movement => {
            this.disable();
        }, bmgl.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        return handler;
    }

    DrawCircle.prototype.disable = function () {
        viewer.container.style.cursor = '';
        this.handler.destroy();
        draw.current = null;
        viewer.entities.remove(this.config.draft);
        if (this.path.length >= 2) {
            // this.config.done.ellipse.semiMajorAxis=this.config.done.ellipse.semiMajorAxis.getValue();
            // this.config.done.ellipse.semiMinorAxis=this.config.done.ellipse.semiMinorAxis.getValue();
            draw.dom.dispatchEvent(new CustomEvent('bm_draw_end', {
                detail: {
                    type: 'circle',
                    entity: this.config.done,
                    path: this.config.prevPosition,
                    radius: this.config.done.ellipse.semiMinorAxis.getValue(),
                }
            }));
        }

    }

    function DrawRuler() {
        this.path = [];
        this.config = {
            distance: 0,
            currentPosition: '',
            prevPosition: '',
            currentHash: '',
            prevHash: '',
            done: '',
            draft: ''
        };
        this.initLabel();
        this.handler = this.initHandler();
    }

    DrawRuler.prototype.initLabel = function () {
        this.labels = new bmgl.LabelCollection();
        viewer.scene.primitives.add(this.labels);
        this.labels.add(createLabel());
    }

    DrawRuler.prototype.initHandler = function () {
        let handler = new bmgl.ScreenSpaceEventHandler(viewer.canvas);
        handler.setInputAction(movement => {
            this.config.currentHash = Math.floor(movement.position.x) + '_' + Math.floor(movement.position.y);
            if (this.config.currentHash === this.config.prevHash) return;
            this.config.prevHash = this.config.currentHash;
            let p = getCurrentPosition(movement.position);
            if (!p) return;
            if (!this.config.prevPosition) {
                let label = createLabel();
                label.text = '起点';
                label.position = p.origin;
                this.labels.add(label);
            } else {
                var c = getDistance(p, this.config.prevPosition);
                this.config.distance += c;
                this.labels.add({
                    backgroundColor: bmgl.Color.WHITE.withAlpha(0.8), showBackground: true,
                    position: p.origin,
                    text: getReadable(this.config.distance),
                    fillColor: bmgl.Color.RED,
                    font: '14px sans-serif',
                    outlineColor: bmgl.Color.RED,
                    outlineWidth: 1.0,
                    horizontalOrigin: bmgl.HorizontalOrigin.LEFT,
                    verticalOrigin: bmgl.VerticalOrigin.BOTTOM,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY
                });
            }
            this.config.prevPosition = p;
            this.path.push(p);
        }, bmgl.ScreenSpaceEventType.LEFT_CLICK);
        handler.setInputAction(movement => {
            let p = getCurrentPosition(movement.endPosition);
            p && (this.config.currentPosition = p);
            if (!this.config.prevPosition) return;
            var d = getDistance(p, this.config.prevPosition);
            this.labels.get(0).text = getReadable(d + this.config.distance);
            this.labels.get(0).position = p.origin;
        }, bmgl.ScreenSpaceEventType.MOUSE_MOVE);

        this.config.done = viewer.entities.add({
            polyline: Object.assign({material: config.color}, config.ruler),
        });
        this.config.done.polyline.positions = new bmgl.CallbackProperty(() => {
            return this.path.length >= 2 ? this.path.map(v => v.origin) : bmgl.Cartesian3.fromDegreesArray([]);
        });
        this.config.draft = viewer.entities.add({
            polyline: this.config.done.polyline.clone(),
        });

        this.config.draft.polyline.material = new bmgl.PolylineDashMaterialProperty({
            color: config.polyline && config.polyline.color || config.color,
        });
        this.config.draft.polyline.positions = new bmgl.CallbackProperty(() => {
            return this.config.prevPosition && this.config.currentPosition ? [this.config.prevPosition.origin, this.config.currentPosition.origin] : bmgl.Cartesian3.fromDegreesArray([]);
        });
        handler.setInputAction(movement => {
            this.disable();
        }, bmgl.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        return handler;
    }

    DrawRuler.prototype.disable = function () {
        viewer.container.style.cursor = '';
        this.handler.destroy();
        draw.current = null;
        viewer.entities.remove(this.config.draft);
        if (this.path.length >= 2) {
            draw.dom.dispatchEvent(new CustomEvent('bm_draw_end', {
                detail: {
                    type: 'ruler',
                    label: this.labels,
                    entity: this.config.done,
                    path: this.path,
                }
            }));
        }

    }

    function DrawMarker() {
        this.handler = this.initHandler();
        this.config = {
            currentHash: '',
            prevHash: '',
        };
    }

    function DrawPolyline() {
        this.path = [];
        this.config = {
            currentPosition: '',
            prevPosition: '',
            currentHash: '',
            prevHash: '',
            done: '',
            draft: ''
        };
        this.handler = this.initHandler();
    }

    DrawPolyline.prototype.initHandler = function () {
        let handler = new bmgl.ScreenSpaceEventHandler(viewer.canvas);
        handler.setInputAction(movement => {
            this.config.currentHash = Math.floor(movement.position.x) + '_' + Math.floor(movement.position.y);
            if (this.config.currentHash === this.config.prevHash) return;
            this.config.prevHash = this.config.currentHash;
            let p = getCurrentPosition(movement.position);
            if (!p) return;
            this.config.prevPosition = p;
            this.path.push(p);
        }, bmgl.ScreenSpaceEventType.LEFT_CLICK);
        handler.setInputAction(movement => {
            let p = getCurrentPosition(movement.endPosition);
            p && (this.config.currentPosition = p);
        }, bmgl.ScreenSpaceEventType.MOUSE_MOVE);
        this.config.done = viewer.entities.add({
            polyline: Object.assign({},{material: config.color}, config.polyline),
        });
        this.config.done.polyline.positions = new bmgl.CallbackProperty(() => {
            return this.path.length >= 2 ? this.path.map(v => v.origin) : bmgl.Cartesian3.fromDegreesArray([]);
        });
        this.config.draft = viewer.entities.add({
            polyline: this.config.done.polyline.clone(),
        });
        this.config.draft.polyline.material = new bmgl.PolylineDashMaterialProperty({
            color: config.polyline && config.polyline.color || config.color,
        });
        this.config.draft.polyline.positions = new bmgl.CallbackProperty(() => {
            return this.config.prevPosition && this.config.currentPosition ? [this.config.prevPosition.origin, this.config.currentPosition.origin] : bmgl.Cartesian3.fromDegreesArray([]);
        });
        handler.setInputAction(movement => {
            this.disable();
        }, bmgl.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        return handler;
    }

    DrawPolyline.prototype.disable = function () {
        viewer.container.style.cursor = '';
        this.handler.destroy();
        draw.current = null;
        viewer.entities.remove(this.config.draft);
        if (this.path.length >= 2) {
            draw.dom.dispatchEvent(new CustomEvent('bm_draw_end', {
                detail: {
                    type: 'polyline',
                    entity: this.config.done,
                    path: this.path,
                }
            }));
        }

    }

    function DrawMarker() {
        this.handler = this.initHandler();
        this.config = {
            currentHash: '',
            prevHash: '',
        };
    }

    DrawMarker.prototype.initHandler = function () {
        let handler = new bmgl.ScreenSpaceEventHandler(viewer.canvas);
        handler.setInputAction(movement => {
            this.config.currentHash = Math.floor(movement.position.x) + '_' + Math.floor(movement.position.y);
            if (this.config.currentHash === this.config.prevHash) return;
            this.config.prevHash = this.config.currentHash;
            draw.dom.dispatchEvent(new CustomEvent('bm_draw_end', {
                detail: {
                    type: 'marker',
                    path: getCurrentPosition(movement.position)
                }
            }));
        }, bmgl.ScreenSpaceEventType.LEFT_CLICK);
        handler.setInputAction(movement => {
            this.disable();
        }, bmgl.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        return handler;
    }

    DrawMarker.prototype.disable = function () {
        viewer.container.style.cursor = '';
        this.handler.destroy();
        draw.current = null;
    }

    function getCurrentPosition(position) {
        var p = viewer.scene.globe.pick(viewer.camera.getPickRay(position), viewer.scene);
        if (!bmgl.defined(p)) return false;
        var cartographic = bmgl.Cartographic.fromCartesian(p);
        return {
            x:position.x,
            y:position.y,
            lng: bmgl.Math.toDegrees(cartographic.longitude),
            lat: bmgl.Math.toDegrees(cartographic.latitude),
            origin: p,
        };
    }

    function getDistance(start, end) {
        return new bmgl.EllipsoidGeodesic(bmgl.Cartographic.fromDegrees(start.lng, start.lat), bmgl.Cartographic.fromDegrees(end.lng, end.lat)).surfaceDistance;
    }

    function getReadable(value, type) {
        switch (type) {
            case 'area':
                return value > 1000000 ? (value / 1000000).toFixed(5) + 'km²' : value.toFixed(2) + 'm²';
            default:
                return value > 1000 ? (value / 1000).toFixed(2) + 'km' : value.toFixed(2) + 'm';
        }
    }

    var earthRadiusMeters = 6371000.0;
    var radiansPerDegree = Math.PI / 180.0;
    var degreesPerRadian = 180.0 / Math.PI;

    function getArea(points) {
        var totalAngle = 0;
        for (var i = 0; i < points.length; i++) {
            var j = (i + 1) % points.length;
            var k = (i + 2) % points.length;
            totalAngle += Angle(points[i], points[j], points[k]);
        }
        var planarTotalAngle = (points.length - 2) * 180.0;
        var sphericalExcess = totalAngle - planarTotalAngle;
        if (sphericalExcess > 420.0) {
            totalAngle = points.length * 360.0 - totalAngle;
            sphericalExcess = totalAngle - planarTotalAngle;
        } else if (sphericalExcess > 300.0 && sphericalExcess < 420.0) {
            sphericalExcess = Math.abs(360.0 - sphericalExcess);
        }
        return sphericalExcess * radiansPerDegree * earthRadiusMeters * earthRadiusMeters;
    }

    /*角度*/
    function Angle(p1, p2, p3) {
        var bearing21 = Bearing(p2, p1);
        var bearing23 = Bearing(p2, p3);
        var angle = bearing21 - bearing23;
        if (angle < 0) {
            angle += 360;
        }
        return angle;
    }

    function createLabel() {
        return {
            backgroundColor: bmgl.Color.WHITE.withAlpha(0.8),
            showBackground: true,
            text: '',
            fillColor: bmgl.Color.RED,
            font: '14px sans-serif',
            outlineColor: bmgl.Color.RED,
            outlineWidth: 1.0,
            horizontalOrigin: bmgl.HorizontalOrigin.LEFT,
            verticalOrigin: bmgl.VerticalOrigin.BOTTOM,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
    }
    
    /*方向*/
    function Bearing(from, to) {
        var lat1 = from.lat * radiansPerDegree;
        var lon1 = from.lng * radiansPerDegree;
        var lat2 = to.lat * radiansPerDegree;
        var lon2 = to.lng * radiansPerDegree;
        var angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
        if (angle < 0) {
            angle += Math.PI * 2.0;
        }
        angle = angle * degreesPerRadian;
        return angle;
    }

    window.BMDraw = BMDraw;
})(window.bmgl);
