const SUPABASE_URL = "COLE_AQUI_A_URL_DO_SEU_PROJETO";
const SUPABASE_KEY = "COLE_AQUI_SUA_CHAVE_SB_PUBLISHABLE";

const scriptSupabase = document.createElement("script");
scriptSupabase.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

scriptSupabase.onload = () => {
    const { createClient } = window.supabase;
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    carregarProjetos(supabase);
    configurarFormulario(supabase);
};

document.head.appendChild(scriptSupabase);

async function carregarProjetos(supabase) {
    const container = document.getElementById("lista-projetos");
    try {
        const { data, error } = await supabase
            .from("projetos")
            .select("*")
            .order("id", { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            container.innerHTML = "<p class='carregando'>Nenhum projeto cadastrado ainda.</p>";
            return;
        }

        container.innerHTML = "";
        data.forEach(projeto => {
            const card = document.createElement("article");
            card.className = "projeto";
            card.innerHTML = `
                ${projeto.imagem ? `<img src="${projeto.imagem}" alt="${projeto.titulo || "Projeto"}">` : ""}
                <div class="projeto-conteudo">
                    <h3>${projeto.titulo || "Projeto"}</h3>
                    <p>${projeto.descricao || ""}</p>
                    ${projeto.link ? `<a href="${projeto.link}" target="_blank" rel="noopener noreferrer" class="projeto-link">Ver projeto →</a>` : ""}
                </div>`;
            container.appendChild(card);
        });
    } catch (error) {
        console.error(error);
        container.innerHTML = "<p class='carregando'>Não foi possível carregar os projetos.</p>";
    }
}

function configurarFormulario(supabase) {
    const formulario = document.getElementById("form-contato");
    const mensagem = document.getElementById("mensagem-form");

    formulario.addEventListener("submit", async event => {
        event.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const texto = document.getElementById("mensagem").value.trim();

        mensagem.textContent = "Enviando...";

        try {
            const { error } = await supabase.from("contatos").insert([
                { nome, email, mensagem: texto }
            ]);

            if (error) throw error;

            mensagem.textContent = "Mensagem enviada com sucesso!";
            formulario.reset();
        } catch (error) {
            console.error(error);
            mensagem.textContent = "Erro ao enviar a mensagem. Tente novamente.";
        }
    });
}