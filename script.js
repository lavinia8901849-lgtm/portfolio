// Cole aqui a Project URL e a chave sb_publishable_ do Supabase.
// NUNCA coloque a sb_secret_ neste arquivo.
const SUPABASE_URL="COLE_AQUI_A_PROJECT_URL";
const SUPABASE_KEY="COLE_AQUI_A_SB_PUBLISHABLE_KEY";

const s=document.createElement("script");
s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
s.onload=()=>{const {createClient}=window.supabase;const supabase=createClient(SUPABASE_URL,SUPABASE_KEY);carregarProjetos(supabase);configurarContato(supabase)};
document.head.appendChild(s);

async function carregarProjetos(supabase){
 const lista=document.getElementById("lista-projetos");
 const {data,error}=await supabase.from("projetos").select("*").order("id",{ascending:false});
 if(error){console.error(error);lista.innerHTML="<p>Erro ao conectar aos projetos.</p>";return}
 if(!data.length){lista.innerHTML="<p>Nenhum projeto cadastrado ainda.</p>";return}
 lista.innerHTML=data.map(p=>`<article class="projeto">${p.imagem?`<img src="${p.imagem}" alt="${p.titulo}">`:""}<h3>${p.titulo}</h3><p>${p.descricao||""}</p>${p.link?`<a href="${p.link}" target="_blank" rel="noopener">Ver projeto →</a>`:""}</article>`).join("");
}

function configurarContato(supabase){
 document.getElementById("form-contato").addEventListener("submit",async e=>{
  e.preventDefault();const status=document.getElementById("mensagem-form");status.textContent="Enviando...";
  const {error}=await supabase.from("contatos").insert({nome:nome.value.trim(),email:email.value.trim(),mensagem:mensagem.value.trim()});
  if(error){console.error(error);status.textContent="Erro ao enviar.";return}
  status.textContent="Mensagem enviada com sucesso!";e.target.reset();
 });
}
