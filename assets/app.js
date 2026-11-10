// Age gate 18+ (localStorage) — protótipo, sem backend
document.addEventListener('DOMContentLoaded',function(){
  if(localStorage.getItem('coj_maior18')==='sim')return;
  // ?skipgate=1 só vale em localhost (testes/screenshots); ignorado em produção
  if(['localhost','127.0.0.1'].includes(location.hostname)&&new URLSearchParams(location.search).get('skipgate')==='1')return;
  const m=document.createElement('div');m.className='modal open';m.id='agegate';
  m.innerHTML='<div class="box" role="dialog" aria-modal="true"><h2 style="border:0;padding:0">Conteúdo para maiores de 18 anos</h2><p>Este site é exclusivo para maiores de 18 anos. Ao entrar, você declara ter 18 anos ou mais e concorda com os <a href="'+(document.body.dataset.base||'')+'termos.html">termos de uso</a>.</p><p><button class="btn" id="ag-sim">Tenho 18 anos ou mais — Entrar</button></p><p><a class="btn ghost" href="https://www.google.com.br">Sair</a></p></div>';
  document.body.appendChild(m);document.getElementById('ag-sim').onclick=()=>{localStorage.setItem('coj_maior18','sim');m.remove();};
});
// Paywall mock
function openPaywall(){document.getElementById('paywall')?.classList.add('open');}
function closePaywall(){document.getElementById('paywall')?.classList.remove('open');}
function vistoTxt(min){if(min<=5)return '<span class="online">● online agora</span>';if(min<60)return 'visto há '+min+' min';const h=Math.floor(min/60);return 'visto há '+h+' h';}
async function loadAnuncios(base){const r=await fetch(base+'data/anuncios.json');return r.json();}

// ---- Helpers compartilhados (catálogo, perfil, planos) ----
function brl(v){return 'R$ '+Number(v).toLocaleString('pt-BR');}
function planClass(p){return {'Diamante':'p-diamante','Super Top':'p-supertop','Top':'p-top','Grátis 24h':'p-top'}[p]||'p-free';}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
// Card de anúncio. Nunca exibe telefone/WhatsApp: o contato fica só no perfil.
function cardHTML(a,base,opts){base=base||'';opts=opts||{};const at=a.atendimento||{};
  const tag=opts.preview?'div':'a',href=opts.preview?'':` href="${base}perfil.html?id=${a.id}"`;
  return `<${tag} class="card ad ${planClass(a.plano)}"${href}><div class="ph"><img src="${base}${a.fotos[0]}" alt="Foto de teste do anúncio de ${esc(a.nome)} (perfil fictício de demonstração)" width="600" height="800"><span class="badge plan">${esc(a.plano)}</span>${a.novo?'<span class="badge new">Novo</span>':''}</div>
<div class="body"><h3>${esc(a.nome)}, ${a.idade}</h3><div class="price-from">a partir de <b>${brl(a.valor_a_partir)}</b></div>
<p class="short">${esc(a.descricao_curta||'')}</p><div class="meta">${esc(a.bairro)} · ${vistoTxt(a.visto_ha_min)}${a._dist!=null?` · 📍 ~${a._dist.toFixed(1)} km`:''}</div>
<div class="modes">${at.presencial?'<span class="badge mode">🏠 Presencial</span>':''}${at.virtual?'<span class="badge mode">💻 Virtual</span>':''}${a.local_proprio?'<span class="badge mode">🔑 Local próprio</span>':''}</div>
${a.verificado.identidade?'<span class="badge">✔ Identidade verificada</span>':'<span class="badge no">Verificação pendente</span>'}${a.verificado.fotos?'<span class="badge">✔ Fotos</span>':''}</div></${tag}>`;}

// ---- Consentimento de cookies (LGPD) ----
// Valor salvo em localStorage 'coj_cookies' = 'aceito' | 'recusado'. Só cookies opcionais (análise) dependem disso.
const GA4_ID='G-XXXXXXX'; // TODO: trocar pelo ID real do GA4 quando o usuário fornecer.
function loadAnalytics(){
  if(window.__gaLoaded)return; window.__gaLoaded=true;
  /* GA4 — DESATIVADO até o ID real ser informado. Para ativar, troque GA4_ID acima e remova este comentário de bloco.
  if(!GA4_ID||GA4_ID==='G-XXXXXXX')return;
  const s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+GA4_ID;document.head.appendChild(s);
  window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments);};
  gtag('js',new Date());gtag('config',GA4_ID,{anonymize_ip:true});
  */
}
function setCookieConsent(v){localStorage.setItem('coj_cookies',v);document.getElementById('cookiebar')?.remove();if(v==='aceito')loadAnalytics();}
function openCookieBanner(){if(document.getElementById('cookiebar'))return;const b=document.body.dataset.base||'';
  const d=document.createElement('div');d.id='cookiebar';d.className='cookiebar';d.setAttribute('role','dialog');d.setAttribute('aria-label','Preferências de cookies');
  d.innerHTML=`<p><b>🍪 Cookies.</b> Usamos cookies essenciais para o site funcionar (como a confirmação de maioridade). Com a sua permissão, também usamos cookies de análise para medir acessos de forma agregada. Você pode mudar isso quando quiser no rodapé. <a href="${b}privacidade.html#cookies">Saiba mais</a>.</p><div class="cb-actions"><button class="btn ghost" id="cb-no">Recusar</button><button class="btn" id="cb-yes">Aceitar</button></div>`;
  document.body.appendChild(d);document.getElementById('cb-yes').onclick=()=>setCookieConsent('aceito');document.getElementById('cb-no').onclick=()=>setCookieConsent('recusado');}
document.addEventListener('DOMContentLoaded',function(){const c=localStorage.getItem('coj_cookies');if(c==='aceito')loadAnalytics();else if(c!=='recusado')openCookieBanner();});
