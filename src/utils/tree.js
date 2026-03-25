export default function createTreeStructure(catNodes, defaultCats, leafNodes) {
    const tree = [];
    const hsCat = {};

    if (defaultCats) {
        for (const cat of defaultCats) {
            if (cat.children) {
                delete cat.children;
                cat.icon = 'folder';
            } else if(!cat.children && !cat.icon) {
                cat.icon = 'database';
            }
            hsCat[cat.id] = cat;
            tree.push(cat);
        }
    }
    
    for (const cat of catNodes) {
        cat.isContextMenuShow = true;
          cat.contextMenuType = 'both';
        if (cat.id === '1') cat.contextMenuType = 'add';
        if (cat.children) delete cat.children;
        cat.icon = 'folder';
        hsCat[cat.id] = cat;
    }
    for (const cat of catNodes) {
        const p = cat.cat_id;
        if (p && hsCat[p]) {
            if (!hsCat[p].children) hsCat[p].children = [];
            hsCat[p].children.push(cat);
        } else {
            tree.push(cat);
        }
    }

    for (const cat of leafNodes) {
        if (cat.children) {
            delete cat.children;
            cat.icon = 'folder';
        } else {
            cat.icon = 'database';
            cat.contextMenuType = 'del';
            cat.isContextMenuShow = true;
        }
        hsCat[cat.id] = cat;
    }
    for (const node of leafNodes) {
        const p = node.cat_id;
        if (p && hsCat[p]) {
            if (!hsCat[p].children) hsCat[p].children = [];
            hsCat[p].children.unshift(node);
        } else if(p === '0') {
            if (!hsCat[`0`].children) hsCat[`0`].children = [];
            hsCat[`0`].children.unshift(node);
        }
    }
    return tree;
}