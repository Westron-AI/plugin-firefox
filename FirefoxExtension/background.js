import BASE_URL from './configs'

browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.create({
        id: "translate",
        title: "Traduzir (Westron AI)",
        contexts: ["selection"], 
    });
});

browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "translate") {
        const selectedText = info.selectionText;

    
        browser.storage.local.get("apiKey").then((data) => {
            const apiKey = data.apiKey;
            console.log(apiKey);
            if (apiKey) {
                translateText(selectedText, apiKey);
            } else {
                console.warn("API key não configurada. Por favor, configure-a.");
            }
        }).catch((error) => {
            console.error("Erro ao recuperar a chave da API:", error);
        });
    }
});

async function translateText(text, apiKey) {
    const url = `${BASE_URL}/translate?token=${apiKey}`;
    console.log("URL da API:", url);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json"
            },
            body: JSON.stringify({
                texto_ingles: text,
            }),
        });
        console.log(response);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro na requisição: ${response.status} ${response.statusText}. Detalhes: ${errorText}`);
        }

        const data = await response.json();
        console.log("Dados da resposta:", data);


        if (data['tradução'] && data['tradução'].texto_portugues) {
            const translatedText = data['tradução'].texto_portugues;
            console.log(`Tradução: ${translatedText}`);

            browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
                browser.tabs.sendMessage(tabs[0].id, {
                    action: "replaceText",
                    translatedText: translatedText,
                });
            });
        } else {
            console.error('Erro: Tradução não encontrada nos dados retornados.');
        }
    } catch (error) {
        console.error('Erro ao acessar a API de tradução:', error);
    }
}
