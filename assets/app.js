// Age gate 18+ (localStorage) — protótipo, sem backend
document.addEventListener('DOMContentLoaded',function(){
  if(localStorage.getItem('coj_maior18')==='sim')return;
  // ?skipgate=1 só vale em localhost (testes/screenshots); ignorado em produção
  if(['localhost','127.0.0.1'].includes(location.hostname)&&new URLSearchParams(location.search).get('skipgate')==='1')return;
  const m=document.createElement('div');m.className='modal open';m.id='agegate';
  m.innerHTML='<div class="box" role="dialog" aria-modal="true"><h2 style="border:0;padding:0">Conteúdo para maiores de 18 anos</h2><p>Este site é exclusivo para maiores de 18 anos. Ao entrar, você declara ter 18 anos ou mais e concorda com os <a href="'+(document.body.dataset.base||'')+'compliance.html">termos e diretrizes</a>.</p><p><button class="btn" id="ag-sim">Tenho 18 anos ou mais — Entrar</button></p><p><a class="btn ghost" href="https://www.google.com.br">Sair</a></p></div>';
  document.body.appendChild(m);document.getElementById('ag-sim').onclick=()=>{localStorage.setItem('coj_maior18','sim');m.remove();};
});
// Paywall mock
function openPaywall(){document.getElementById('paywall')?.classList.add('open');}
function closePaywall(){document.getElementById('paywall')?.classList.remove('open');}
function vistoTxt(min){if(min<=5)return '<span class="online">● online agora</span>';if(min<60)return 'visto há '+min+' min';const h=Math.floor(min/60);return 'visto há '+h+' h';}
async function loadAnuncios(base){const r=await fetch(base+'data/anuncios.json');return r.json();}
