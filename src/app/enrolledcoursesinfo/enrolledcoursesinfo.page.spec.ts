import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EnrolledcoursesinfoPage } from './enrolledcoursesinfo.page';

describe('EnrolledcoursesinfoPage', () => {
  let component: EnrolledcoursesinfoPage;
  let fixture: ComponentFixture<EnrolledcoursesinfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrolledcoursesinfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EnrolledcoursesinfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
