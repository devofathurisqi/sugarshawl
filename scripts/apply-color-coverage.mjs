import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
export async function applyColorCoverage(products) {
 const coverage=JSON.parse(await readFile(new URL('../catalog/color-coverage.json',import.meta.url),'utf8'));
 for(const p of coverage.newProducts||[])if(!products.some(x=>x.id===p.id))products.push(structuredClone(p));
 for(const p of products){
  const entry=coverage.products[p.id];
  if(!entry)throw new Error('Missing color audit: '+p.id);
  Object.assign(p,structuredClone(entry.patch));
 }
 return products;
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const target=new URL('../src/data/products.json',import.meta.url);
 const products=await applyColorCoverage(JSON.parse(await readFile(target,'utf8')));
 await writeFile(target,JSON.stringify(products,null,2)+'\n');
 console.log(`Applied audited colors to ${products.length} Sugar Shawl products.`);
}
