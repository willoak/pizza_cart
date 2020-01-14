const qs = (el) => document.querySelector(el);
const qsa = (el) => document.querySelectorAll(el);
const real = (value) => (value).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})
let modalQtd = 1;
let cart = [];
let modalKey = 0;

pizzaJson.map( (item, index) => {
    //clonando o modelo html
    let pizzaItem = qs(".models .pizza-item").cloneNode(true);

    //setando os dados no modelo hmtl
    pizzaItem.setAttribute("data-key", index);
    pizzaItem.querySelector(".pizza-item--img img").src = item.img;
    pizzaItem.querySelector(".pizza-item--price").innerHTML = real(item.price);
    pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
    pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;

    //mostrando o modal com os dados do item clicado
    pizzaItem.querySelector("a").addEventListener("click",(e)=>{
        e.preventDefault();
        let key = e.target.closest(".pizza-item").getAttribute("data-key");
        modalQtd = 1;
        modalKey = key;

        //aqui usamos o id para buscar o item dentro do array principal dos produtos e tambem preenchemos o modal com os dados do item clicado
        qs(".pizzaBig img").src = pizzaJson[modalKey].img;
        qs(".pizzaInfo h1").innerHTML = pizzaJson[modalKey].name;
        qs(".pizzaInfo--desc").innerHTML = pizzaJson[modalKey].description;
        qs(".pizzaInfo--actualPrice").innerHTML = real(pizzaJson[modalKey].price);

        //removemos a class do item selecionado
        qs(".pizzaInfo--size.selected").classList.remove("selected");
        
        
        qsa(".pizzaInfo--size").forEach( (size, sizeIndex) => {
            if(sizeIndex == 2){
                size.classList.add("selected");
            }
            size.querySelector("span").innerHTML = pizzaJson[modalKey].sizes[sizeIndex];
        });        

        qs(".pizzaInfo--qt").innerHTML = modalQtd;

        //mostrando o modal já preenchido com os dados
        qs(".pizzaWindowArea").style.opacity = 0;
        qs(".pizzaWindowArea").style.display = "flex";
        setTimeout( () => {
            qs(".pizzaWindowArea").style.opacity = 1;
        }, 200);

    });

    qs(".pizza-area").append(pizzaItem);

});

//aumentar qtd produto
qs(".pizzaInfo--qtmais").addEventListener("click",()=>{
    modalQtd++;
    qs(".pizzaInfo--qt").innerHTML = modalQtd;
});

//diminuir qtd produto
qs(".pizzaInfo--qtmenos").addEventListener("click",()=>{
    if(modalQtd > 1) modalQtd--;
    qs(".pizzaInfo--qt").innerHTML = modalQtd;
});

closeModal = () => {
    qs(".pizzaWindowArea").style.display = "none";

    //animacao do modal fechando - fazer depois
}

qs(".pizzaInfo--cancelButton").addEventListener("click",closeModal);

//adicionar class de item selecionado no modal
qsa(".pizzaInfo--size").forEach( (size, sizeIndex) => {
    size.addEventListener("click",(e)=>{
        qs(".pizzaInfo--size.selected").classList.remove("selected");
        size.classList.add("selected");    
    });
}); 

qs(".pizzaInfo--addButton").addEventListener("click",()=>{
    //selecionando qual tamanho foi selecionado
    let size = parseInt(qs(".pizzaInfo--size.selected").getAttribute("data-key"));

    //criando identificador para evitar duplicidade dos items, queremos alterar apenas a quantidade
    let identifier = pizzaJson[modalKey].id+"@"+size;

    //verificamos se o item já existe no carrinho
    // se retornar -1 significa que nao existia o produto no carrinho
    //se for mais que -1, significa que existe o produto no carrinho, entao sera atualizado apenas a quantidade do mesmo no carrinho. o findindex identifica o item por isso podemos usar o key para atualizar o cart
    let key = cart.findIndex( (item) => item.identifier == identifier);

    if( key > -1 ) {
        cart[key].qtd += modalQtd
    } else {
        //se nao, ele adiciona um novo produto no carrinho
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qtd: modalQtd
        });
    }

    closeModal();
    updateCart();
});

updateCart = () => {
    if(cart.length > 0) {
        //resetar o carrinho sempre que add um item
        console.log(cart.length)
        qs(".cart").innerHTML = "";
        qs("aside").classList.add("show");

        let subtotal = 0, desconto = 0, total = 0;

        //identificando as pizzas adicionadas no cart, o for foi usado para verificar se no nosso carrinho tem o produto que esta no pizzaJson, se sim, ele retorna o item para podermos mostrar os dados no carrinho
        for (let i in cart) {
            
            let pizzaItem = pizzaJson.find( (item) => item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qtd;
            console.log(subtotal)

            let pizzaNameSize = cart[i].size;

            switch (pizzaNameSize) {
                case 0:
                    pizzaNameSize = "P"
                    break;
                case 1:
                    pizzaNameSize = "M"
                    break;
                case 2:
                    pizzaNameSize = "G"
                    break   
            }

            let pizzaName = `${pizzaItem.name} (${pizzaNameSize})`;

            let cartItems = qs(".models .cart--item").cloneNode(true);

            cartItems.querySelector("img").src = pizzaItem.img;
            cartItems.querySelector(".cart--item-nome").innerHTML = pizzaName;
            cartItems.querySelector(".cart--item--qt").innerHTML = cart[i].qtd;
            cartItems.querySelector(".cart--item-qtmais").addEventListener("click", ()=>{
                cart[i].qtd++;
                updateCart();
            });
            cartItems.querySelector(".cart--item-qtmenos").addEventListener("click", ()=>{
                if(cart[i].qtd > 1) {
                    cart[i].qtd--;
                } else {
                    cart.splice(i,1);
                }
                updateCart();
            });

            qs(".cart").append(cartItems);

        }

        desconto = subtotal * .1;
        total = subtotal - desconto;

        qs(".subtotal span:last-child").innerHTML = real(subtotal);
        qs(".desconto span:last-child").innerHTML = real(desconto);
        qs(".total span:last-child").innerHTML = real(total);

    } else {
        qs("aside").classList.remove("show");
    }
}
