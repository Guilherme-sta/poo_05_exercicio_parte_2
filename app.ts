import prompt from "prompt-sync";
import { Banco, Conta, Cliente } from "./banco";
class App {
    banco: Banco;
    input = prompt();

    constructor() {
        this.banco = new Banco();
        this.banco.carregarDados();
    }

    menu(): void {
        let opcao: string = '';
        do {
            console.log('\n===== SISTEMA BANCÁRIO =====');
            console.log('\nContas:');
            console.log('01 - Inserir');
            console.log('02 - Consultar');
            console.log('03 - Sacar');
            console.log('04 - Depositar');
            console.log('05 - Excluir');
            console.log('06 - Transferir');
            console.log('07 - Transferência múltipla');
            console.log('08 - Quantidade de contas');
            console.log('09 - Total de dinheiro');
            console.log('10 - Média de saldos');
            console.log('11 - Mudança de titularidade');
            console.log('12 - Contas sem cliente');
            console.log('\nClientes:');
            console.log('20 - Inserir');
            console.log('21 - Consultar');
            console.log('22 - Associar conta a cliente');
            console.log('23 - Excluir');
            console.log('24 - Atualizar cliente');
            console.log('\n0 - Sair');
            opcao = this.input('Opção: ');
            this.executarOpcao(opcao);
        } while (opcao != '0');
    }

    executarOpcao(opcao: string): void {
        switch (opcao) {
            case '01': this.inserirConta(); break;
            case '02': this.consultarConta(); break;
            case '03': this.sacar(); break;
            case '04': this.depositar(); break;
            case '05': this.excluirConta(); break;
            case '06': this.transferir(); break;
            case '07': this.transferirMultiplas(); break;
            case '08': console.log('Quantidade de contas:', this.banco.quantidadeContas()); break;
            case '09': console.log('Total de dinheiro no banco: R$', this.banco.totalDinheiro()); break;
            case '10': console.log('Média dos saldos:', this.banco.mediaSaldos()); break;
            case '11': this.mudarTitularidade(); break;
            case '12': this.listarContasSemCliente(); break;
            case '20': this.inserirCliente(); break;
            case '21': this.consultarCliente(); break;
            case '22': this.associarContaCliente(); break;
            case '23': this.excluirCliente(); break;
            case '24': this.atualizarCliente(); break;
            case '0': console.log("Aplicação encerrada."); break;
            default: console.log("Opção inválida!");
        }
    }

    inserirConta(): void {
        const id = Number(this.input('ID da conta: '));
        const numero = this.input('Número da conta: ');
        const saldo = Number(this.input('Saldo inicial: '));
        const conta = new Conta(id, numero, new Date(), saldo);
        this.banco.inserirConta(conta);
    }

    consultarConta(): void {
        const numero = this.input('Número da conta: ');
        const conta = this.banco.consultarConta(numero);
        if (conta)
            console.log(`Conta: ${conta.numero} | Saldo: R$${conta.saldo} | Cliente: ${conta.cliente?.nome ?? 'Sem cliente'}`);
        else console.log('Conta não encontrada.');
    }

    sacar(): void {
        const numero = this.input('Número da conta: ');
        const valor = Number(this.input('Valor do saque: '));
        this.banco.sacar(numero, valor);
    }

    depositar(): void {
        const numero = this.input('Número da conta: ');
        const valor = Number(this.input('Valor do depósito: '));
        this.banco.depositar(numero, valor);
    }

    transferir(): void {
        const origem = this.input('Conta origem: ');
        const destino = this.input('Conta destino: ');
        const valor = Number(this.input('Valor: '));
        this.banco.transferir(origem, destino, valor);
    }

    transferirMultiplas(): void {
        const origem = this.input('Conta origem: ');
        const lista = this.input('Contas destino (separe por vírgulas): ').split(',');
        const valor = Number(this.input('Valor para cada destino: '));
        this.banco.transferirParaVariasContas(origem, lista, valor);
    }

    mudarTitularidade(): void {
        const numero = this.input('Número da conta: ');
        const novoCpf = this.input('Novo CPF do titular: ');
        this.banco.mudarTitularidade(numero, novoCpf);
    }

    excluirCliente(): void {
        const cpf = this.input('CPF do cliente: ');
        this.banco.excluirCliente(cpf);
    }

    excluirConta(): void {
        const numero = this.input('Número da conta: ');
        this.banco.excluirConta(numero);
    }
    
    listarContasSemCliente(): void {
        const semCliente = this.banco.listarContasSemCliente();
        if (semCliente.length === 0) console.log("Não há contas sem cliente.");
        else {
            console.log("Contas sem cliente:");
            for (let conta of semCliente) console.log(`- Conta nº ${conta.numero}`);
            for (let conta of semCliente) {
                const associar = this.input(`Deseja associar um cliente à conta nº ${conta.numero}? (s/n): `).toLowerCase();
                if (associar === 's') {
                    const cpf = this.input('Digite o CPF do cliente: ');
                    this.banco.mudarTitularidade(conta.numero, cpf);
                }
            }
        }
    }
    
    inserirCliente(): void {
        const id = Number(this.input('ID: '));
        const nome = this.input('Nome: ');
        const cpf = this.input('CPF: ');
        const nasc = new Date(this.input('Data de nascimento (YYYY-MM-DD): '));
        const cliente = new Cliente(id, nome, cpf, nasc);
        this.banco.inserirCliente(cliente);
    }

    consultarCliente(): void {
        const cpf = this.input('CPF: ');
        const cliente = this.banco.clientes.find(c => c.cpf === cpf);
        if (cliente)
            console.log(`Cliente: ${cliente.nome} | CPF: ${cliente.cpf}`);
        else console.log('Cliente não encontrado.');
    }

    associarContaCliente(): void {
        const numero = this.input('Número da conta: ');
        const cpf = this.input('CPF do cliente: ');
        const conta = this.banco.consultarConta(numero);
        const cliente = this.banco.clientes.find(c => c.cpf === cpf);
        if (conta && cliente) {
            conta.cliente = cliente;
            cliente.contas.push(conta);
            console.log('Conta associada ao cliente com sucesso!');
        } else console.log('Conta ou cliente não encontrado.');
    }

    atualizarCliente(): void {
        const cpf = this.input('CPF do cliente a ser atualizado: ');
        const novoNome = this.input('Novo nome do cliente: ');
        this.banco.atualizarCliente(cpf, novoNome);
    }    
}

const app = new App();
app.menu();