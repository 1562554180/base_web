
export function getDisposeValue (n, v, type = '') {
  const values = [];
  for(let i = 0, l = v.length; i < l/n; i++){
    const str = v.slice(n * i, n * (i+1));
    values.push(str);
  }
  if(type === 'node') {
    return (
      <div style={{cursor:'pointer'}}>
        {values.map(item => (<p key={item} style={{marginBottom:4}}>{item}</p>))}
      </div>
    )
  }
  return values;
}
