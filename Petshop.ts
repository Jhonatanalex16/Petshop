// Interface garantindo que todas as classes sigam o mesmo padrão
interface IAgendamento {
    iniciarAtendimento(): void;
    finalizarAtendimento(): void;
}

// Classe abstrata que define o modelo base para os animais
abstract class AnimalBase {
    protected id: number;
    protected nome: string;
    protected tutor: string;
    protected servico: number;
    protected status: string;
    protected proximo: Animal | null = null;

    constructor(id: number, nome: string, tutor: string, servico: number) {
        if (!nome || !tutor) throw new Error("Nome e tutor são obrigatórios");
        if (![1, 2].includes(servico)) throw new Error("Serviço inválido");
        
        this.id = id;
        this.nome = nome;
        this.tutor = tutor;
        this.servico = servico;
        this.status = "Aguardando";
    }
    
    abstract atender(): void;
    
    getNome(): string { return this.nome; }
    getStatus(): string { return this.status; }
    setStatus(novoStatus: string): void { this.status = novoStatus; }
}

// Classe concreta que herda de AnimalBase e implementa IAgendamento
class Animal extends AnimalBase implements IAgendamento {
    constructor(id: number, nome: string, tutor: string, servico: number) {
        super(id, nome, tutor, servico);
    }
    
    atender() {
        this.status = "Em andamento";
    }
    
    iniciarAtendimento() {
        console.log(`${this.nome} foi chamado para atendimento!`);
        this.atender();
    }
    
    finalizarAtendimento() {
        this.status = "Finalizado";
        console.log(`${this.nome} teve o atendimento finalizado!`);
    }
}

// Classe para gerenciar a fila de entrada
class Fila {
    private inicio: Animal | null = null;
    private final: Animal | null = null;
    private qtdAnimais: number = 0;

    enfileirar(animal: Animal) {
        if (!this.inicio) this.inicio = this.final = animal;
        else {
            this.final!.proximo = animal;
            this.final = animal;
        }
        this.qtdAnimais++;
    }

    desenfileirar(): Animal | null {
        if (!this.inicio) throw new Error("Fila vazia");
        const animalChamado = this.inicio;
        this.inicio = this.inicio.proximo;
        if (!this.inicio) this.final = null;
        this.qtdAnimais--;
        return animalChamado;
    }
}

// Classe para empilhar animais (Pilha)
class Pilha {
    private topo: Animal | null = null;
    private qtd: number = 0;
    
    empilhar(animal: Animal) {
        animal.proximo = this.topo;
        this.topo = animal;
        this.qtd++;
    }
    
    desempilhar(): Animal | null {
        if (!this.topo) throw new Error("Pilha vazia");
        const animalRemovido = this.topo;
        this.topo = this.topo.proximo;
        this.qtd--;
        return animalRemovido;
    }
}

// Classe de Atendimento
class Atendimento {
    private animaisEmAtendimento: Animal[] = [];
    private maxAtendimentos = 3;
    
    iniciarAtendimento(animal: Animal) {
        if (this.animaisEmAtendimento.length >= this.maxAtendimentos) {
            throw new Error("Capacidade de atendimento cheia");
        }
        animal.iniciarAtendimento();
        this.animaisEmAtendimento.push(animal);
    }
    
    finalizarAtendimento(): Animal {
        if (this.animaisEmAtendimento.length === 0) throw new Error("Nenhum animal em atendimento");
        const animal = this.animaisEmAtendimento.shift()!;
        animal.finalizarAtendimento();
        return animal;
    }
}

// Instâncias do sistema
let contID = 1;
const filaEntrada = new Fila();
const filaSaida = new Pilha();
const atendimento = new Atendimento();

// CRUD
function cadastrarAnimal(nome: string, tutor: string, servico: number) {
    try {
        const novoAnimal = new Animal(contID++, nome, tutor, servico);
        filaEntrada.enfileirar(novoAnimal);
        console.log("Animal cadastrado e aguardando atendimento!");
    } catch (error) {
        console.log(error.message);
    }
}

function chamarParaAtendimento() {
    try {
        const animal = filaEntrada.desenfileirar();
        if (animal) atendimento.iniciarAtendimento(animal);
    } catch (error) {
        console.log(error.message);
    }
}

function liberarAnimal() {
    try {
        const animal = atendimento.finalizarAtendimento();
        filaSaida.empilhar(animal);
        console.log(`${animal.getNome()} foi liberado para entrega!`);
    } catch (error) {
        console.log(error.message);
    }
}

function entregarAnimais() {
    try {
        for (let i = 0; i < 3; i++) {
            const animal = filaSaida.desempilhar();
            console.log(`Animal ${animal?.getNome()} foi entregue ao tutor!`);
        }
    } catch (error) {
        console.log(error.message);
    }
}

// Testes
cadastrarAnimal("Rex", "João", 1);
cadastrarAnimal("Luna", "Maria", 2);
cadastrarAnimal("Bobby", "Carlos", 1);
chamarParaAtendimento();
chamarParaAtendimento();
chamarParaAtendimento();
liberarAnimal();
entregarAnimais();
