import { Injectable } from '@nestjs/common';

@Injectable()
export class DocumentValidator {
  /**
   * Valida se um número de CPF é válido.
   * @param cpf O CPF a ser validado (apenas números)
   * @returns true se o CPF for válido, false caso contrário
   */
  isValidCPF(cpf: string): boolean {
    if (!cpf) return false;
    
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, '');
    
    // CPF deve ter 11 dígitos
    if (cpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais (caso inválido)
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Calcula o primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    let digit1 = remainder >= 10 ? 0 : remainder;
    
    // Calcula o segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    let digit2 = remainder >= 10 ? 0 : remainder;
    
    // Verifica se os dígitos calculados são iguais aos informados
    return digit1 === parseInt(cpf.charAt(9)) && digit2 === parseInt(cpf.charAt(10));
  }
  
  /**
   * Valida se um número de CNPJ é válido.
   * @param cnpj O CNPJ a ser validado (apenas números)
   * @returns true se o CNPJ for válido, false caso contrário
   */
  isValidCNPJ(cnpj: string): boolean {
    if (!cnpj) return false;
    
    // Remove caracteres não numéricos
    cnpj = cnpj.replace(/[^\d]/g, '');
    
    // CNPJ deve ter 14 dígitos
    if (cnpj.length !== 14) return false;
    
    // Verifica se todos os dígitos são iguais (caso inválido)
    if (/^(\d)\1{13}$/.test(cnpj)) return false;
    
    // Calcula o primeiro dígito verificador
    let sum = 0;
    let weight = 5;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cnpj.charAt(i)) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }
    let remainder = sum % 11;
    let digit1 = remainder < 2 ? 0 : 11 - remainder;
    
    // Calcula o segundo dígito verificador
    sum = 0;
    weight = 6;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cnpj.charAt(i)) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }
    remainder = sum % 11;
    let digit2 = remainder < 2 ? 0 : 11 - remainder;
    
    // Verifica se os dígitos calculados são iguais aos informados
    return digit1 === parseInt(cnpj.charAt(12)) && digit2 === parseInt(cnpj.charAt(13));
  }
  
  /**
   * Valida um documento, verificando se é um CPF ou CNPJ válido.
   * @param document O documento a ser validado (apenas números)
   * @returns true se o documento for um CPF ou CNPJ válido, false caso contrário
   */
  isValidDocument(document: string): boolean {
    if (!document) return false;
    
    // Remove caracteres não numéricos
    document = document.replace(/[^\d]/g, '');
    
    // Verifica o número de dígitos para determinar se é CPF ou CNPJ
    if (document.length === 11) {
      return this.isValidCPF(document);
    } else if (document.length === 14) {
      return this.isValidCNPJ(document);
    }
    
    return false;
  }
  
  /**
   * Formata um CPF com a máscara padrão: XXX.XXX.XXX-XX
   * @param cpf O CPF a ser formatado (apenas números)
   * @returns O CPF formatado ou o valor original se não for possível formatar
   */
  formatCPF(cpf: string): string {
    if (!cpf || cpf.length !== 11) return cpf;
    
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  
  /**
   * Formata um CNPJ com a máscara padrão: XX.XXX.XXX/XXXX-XX
   * @param cnpj O CNPJ a ser formatado (apenas números)
   * @returns O CNPJ formatado ou o valor original se não for possível formatar
   */
  formatCNPJ(cnpj: string): string {
    if (!cnpj || cnpj.length !== 14) return cnpj;
    
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  /**
   * Formata um documento (CPF ou CNPJ) com a máscara apropriada
   * @param document O documento a ser formatado (apenas números)
   * @returns O documento formatado ou o valor original se não for possível formatar
   */
  formatDocument(document: string): string {
    if (!document) return document;
    
    // Remove caracteres não numéricos
    document = document.replace(/[^\d]/g, '');
    
    if (document.length === 11) {
      return this.formatCPF(document);
    } else if (document.length === 14) {
      return this.formatCNPJ(document);
    }
    
    return document;
  }
}