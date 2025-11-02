class Cliente {
    id: number;
    nome: string;
    cpf: string;
    dataNascimento: Date;
    contas: Conta[] = [];

    constructor(id: number, nome: string, cpf: string, dataNascimento: Date) {
        this.id = id;
        this.nome = nome;
        this.cpf = cpf;
        this.dataNascimento = dataNascimento;
    }
}

class Conta {
    id: number;
    numero: string;
    cliente!: Cliente;
    dataAbertura: Date;
    saldo: number;

    constructor(id: number, numero: string, dataAbertura: Date, saldoInicial: number) {
        this.id = id;
        this.numero = numero;
        this.dataAbertura = dataAbertura;
        this.saldo = saldoInicial;
    }

    depositar(valor: number): void { this.saldo += valor; }
    sacar(valor: number): void { this.saldo -= valor; }
    transferir(contaDestino: Conta, valor: number): void { this.sacar(valor); contaDestino.depositar(valor); }
    consultarSaldo(): number { return this.saldo; }
}

class Banco {
    contas: Conta[] = [];
    clientes: Cliente[] = [];

    inserirCliente(cliente: Cliente): void {
        const existe = this.clientes.find(c => c.cpf === cliente.cpf);
        if (existe) { console.log("Erro: cliente já cadastrado!"); return; }
        this.clientes.push(cliente);
    }

    inserirConta(conta: Conta): void {
        const existe = this.contas.find(c => c.numero === conta.numero);
        if (existe) { console.log("Erro: conta já existente!"); return; }
        this.contas.push(conta);
    }

    consultarConta(numero: string): Conta | undefined {
        return this.contas.find(c => c.numero === numero);
    }

    excluirConta(numero: string): void {
        const indice = this.contas.findIndex(c => c.numero === numero);
        if (indice >= 0) {
            this.contas.splice(indice, 1);
            console.log("Conta excluída com sucesso!");
        } else console.log("Conta não encontrada.");
    }

    atualizarCliente(cpf: string, novoNome: string): void {
        const cliente = this.clientes.find(c => c.cpf === cpf);
        if (cliente) { cliente.nome = novoNome; console.log("Cliente atualizado com sucesso!"); }
        else console.log("Cliente não encontrado.");
    }

    sacar(numero: string, valor: number): void {
        const conta = this.consultarConta(numero);
        if (conta) { conta.sacar(valor); console.log(`Saque de R$${valor} realizado.`); }
        else console.log("Conta não encontrada.");
    }

    depositar(numero: string, valor: number): void {
        const conta = this.consultarConta(numero);
        if (conta) { conta.depositar(valor); console.log(`Depósito de R$${valor} realizado.`); }
        else console.log("Conta não encontrada.");
    }

    transferir(numeroOrigem: string, numeroDestino: string, valor: number): void {
        const origem = this.consultarConta(numeroOrigem);
        const destino = this.consultarConta(numeroDestino);
        if (origem && destino) { origem.transferir(destino, valor); console.log(`Transferência de R$${valor} concluída.`); }
        else console.log("Conta origem ou destino não encontrada.");
    }

    transferirParaVariasContas(numeroOrigem: string, contasDestino: string[], valor: number): void {
        const origem = this.consultarConta(numeroOrigem);
        if (!origem) { console.log("Conta de origem não encontrada."); return; }
        for (let numero of contasDestino) {
            const destino = this.consultarConta(numero);
            if (destino) origem.transferir(destino, valor);
        }
        console.log("Transferências múltiplas realizadas.");
    }

    quantidadeContas(): number { return this.contas.length; }
    totalDinheiro(): number { return this.contas.reduce((t, c) => t + c.saldo, 0); }
    mediaSaldos(): number { return this.totalDinheiro() / this.quantidadeContas(); }

    mudarTitularidade(numero: string, novoCpf: string): void {
        const conta = this.consultarConta(numero);
        const novoCliente = this.clientes.find(c => c.cpf === novoCpf);
        if (conta && novoCliente) { conta.cliente = novoCliente; console.log("Titularidade alterada."); }
        else console.log("Conta ou cliente não encontrado.");
    }

    excluirCliente(cpf: string): void {
        const cliente = this.clientes.find(c => c.cpf === cpf);
        if (!cliente) { console.log("Cliente não encontrado."); return; }
        this.contas = this.contas.filter(c => c.cliente.cpf !== cpf);
        this.clientes = this.clientes.filter(c => c.cpf !== cpf);
        console.log("Cliente e suas contas foram excluídos.");
    }

    listarContasSemCliente(): Conta[] {
        return this.contas.filter(c => !c.cliente);
    }
    
    carregarDados(): void {
        const c1 = new Cliente(1, "Ana", "111", new Date("1990-01-01"));
        const c2 = new Cliente(2, "Bruno", "222", new Date("1985-05-10"));
        const c3 = new Cliente(3, "Carlos", "333", new Date("1995-08-20"));
        const c4 = new Cliente(4, "Diana", "444", new Date("2000-03-15"));
        const c5 = new Cliente(5, "Eduardo", "555", new Date("1988-12-12"));
        this.clientes.push(c1, c2, c3, c4, c5);
        const a = new Conta(1, "100", new Date(), 1000); a.cliente = c1;
        const b = new Conta(2, "200", new Date(), 2000); b.cliente = c2;
        const c = new Conta(3, "300", new Date(), 3000); c.cliente = c3;
        const d = new Conta(4, "400", new Date(), 4000); d.cliente = c4;
        const e = new Conta(5, "500", new Date(), 5000); e.cliente = c5;
        this.contas.push(a, b, c, d, e);
    }
}

export { Conta, Cliente, Banco };