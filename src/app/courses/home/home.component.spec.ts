import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { setupCourses } from '../common/setup-test-data';
import { click } from '../common/test-utils';
import { CoursesModule } from '../courses.module';
import { CoursesService } from '../services/courses.service';

import { HomeComponent } from './home.component';


describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let element: DebugElement;
  let coursesService: any;
  const beginnerCourses = setupCourses().filter(course => course.category === 'BEGINNER');
  const advancedCourses = setupCourses().filter(course => course.category === 'ADVANCED');

  beforeEach(waitForAsync(() => {

    const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses']);

    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: CoursesService,
          useValue: coursesServiceSpy,
        },
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement;
        coursesService = TestBed.get(CoursesService);
      });
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  it('should display only beginner courses', () => {
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));
    fixture.detectChanges();
    const tabs = element.queryAll(By.css('.mat-tab-label'));
    expect(tabs.length).toBe(1, ' Only beginner courses tab should be displayed');
  });


  it('should display only advanced courses', () => {
    coursesService.findAllCourses.and.returnValue(of(advancedCourses));
    fixture.detectChanges();
    const tabs = element.queryAll(By.css('.mat-tab-label'));
    expect(tabs.length).toBe(1, ' Only advanced courses tab should be displayed');
  });


  it('should display both tabs', () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = element.queryAll(By.css('.mat-tab-label'));
    expect(tabs.length).toBe(2, ' Both courses tabs should be displayed');
  });

  it('should display advanced courses when tab clicked', fakeAsync((/*done: DoneFn*/) => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = element.queryAll(By.css('.mat-tab-label'));
    click(tabs[1]);
    fixture.detectChanges();
    // setTimeout(() => {
    //   const cardTitles = element.queryAll(By.css('.mat-tab-body-active .mat-card-title'));
    //   expect(cardTitles.length).toBeGreaterThan(0, 'Could not find any card titles');
    //   expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');
    //   done();
    // }, 500);
    flush();
    const cardTitles = element.queryAll(By.css('.mat-tab-body-active .mat-card-title'));
    expect(cardTitles.length).toBeGreaterThan(0, 'Could not find any card titles');
    expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');
  }));

  it('should display advanced courses when tab clicked - Async version', waitForAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = element.queryAll(By.css('.mat-tab-label'));
    click(tabs[1]);
    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {
        const cardTitles = element.queryAll(By.css('.mat-tab-body-active .mat-card-title'));
        expect(cardTitles.length).toBeGreaterThan(0, 'Could not find any card titles');
        expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');
      });
  }));
});
