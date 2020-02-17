import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NetworkDetectionPage } from './network-detection.page';

describe('NetworkDetectionPage', () => {
  let component: NetworkDetectionPage;
  let fixture: ComponentFixture<NetworkDetectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkDetectionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NetworkDetectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
