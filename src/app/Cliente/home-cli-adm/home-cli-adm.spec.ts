import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeCliAdm } from './home-cli-adm';

describe('HomeCliAdm', () => {
  let component: HomeCliAdm;
  let fixture: ComponentFixture<HomeCliAdm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeCliAdm],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeCliAdm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
