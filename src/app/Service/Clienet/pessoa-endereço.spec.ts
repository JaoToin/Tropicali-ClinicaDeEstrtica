import { TestBed } from '@angular/core/testing';
import { PessoaEndereço } from '../pessoa-endereço';

describe('PessoaEndereço', () => {
  let service: PessoaEndereço;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PessoaEndereço);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
