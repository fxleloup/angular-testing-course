import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {CoursesModule} from '../courses.module';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {CoursesService} from '../services/courses.service';
import {setupCourses} from '../common/setup-test-data';
import {Course} from '../model/course';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';


fdescribe('HomeComponent', () => {

  let componentUnderTestStateDriver: ComponentFixture<HomeComponent>;
  let componentUnderTest: HomeComponent;
  let componentUnderTestSpy: DebugElement;
  let coursesServiceSpy: any;

  const givenOnlyBeginnerCourses: Course[] = setupCourses().filter(course => course.category === 'BEGINNER');
  const givenOnlyAdvancedCourses: Course[] = setupCourses().filter(course => course.category === 'ADVANCED');
  const givenAllCourses: Course[] = setupCourses();

  beforeEach(async(() => {
    const coursesServiceSpyProvided = jasmine.createSpyObj('CoursesService', ['findAllCourses']);

    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        NoopAnimationsModule // mode de test sans exécution d'animation animation
      ],
      providers: [{
        provide: CoursesService,
        useValue: coursesServiceSpyProvided
      }]
    })
      .compileComponents()
      // compilé en asynchrone, donc on rajoute async pour attendre la fin de l'exécution
      // de la fonction passée en paramètre du bloc beforeEach avant d'attaquer les tests
      .then(() => {
        componentUnderTestStateDriver = TestBed.createComponent(HomeComponent); // fixture
        componentUnderTest = componentUnderTestStateDriver.componentInstance;
        componentUnderTestSpy = componentUnderTestStateDriver.debugElement; // debugElement
        coursesServiceSpy = TestBed.get(CoursesService);
      });
  }));

  it('should create the component', () => {
    expect(componentUnderTest).toBeTruthy();
  });

  it('should display only beginner courses if no other course type found', () => {
    // given
    coursesServiceSpy.findAllCourses.and.returnValue(of(givenOnlyBeginnerCourses));
    // when
    componentUnderTestStateDriver.detectChanges();
    // then
    const tabElementSpies: DebugElement[] = componentUnderTestSpy.queryAll(By.css('.mat-tab-label'));
    expect(tabElementSpies.length).toBe(1, 'On n\'aurait dû récupérer que le tab Beginners');
    const tabBeginnerLabelContentElementSpy: DebugElement = componentUnderTestSpy.query(By.css('.mat-tab-label-content'));
    const tabBeginnerLabelContentElement: Element = tabBeginnerLabelContentElementSpy.nativeElement;
    expect(tabBeginnerLabelContentElement.textContent).toBe('Beginners');
  });

  it('should display only advanced courses if no other course type found', () => {
    // given
    coursesServiceSpy.findAllCourses.and.returnValue(of(givenOnlyAdvancedCourses));
    // when
    componentUnderTestStateDriver.detectChanges();
    // then
    const tabElementSpies: DebugElement[] = componentUnderTestSpy.queryAll(By.css('.mat-tab-label'));
    expect(tabElementSpies.length).toBe(1, 'On n\'aurait dû récupérer que le tab Advanced');
    const tabAdvancedLabelContentElementSpy: DebugElement = componentUnderTestSpy.query(By.css('.mat-tab-label-content'));
    const tabAdvancedLabelContentElement: Element = tabAdvancedLabelContentElementSpy.nativeElement;
    expect(tabAdvancedLabelContentElement.textContent).toBe('Advanced');
  });

  it('should display both tabs if both course types found', () => {
    // given
    coursesServiceSpy.findAllCourses.and.returnValue(of(givenAllCourses));
    // when
    componentUnderTestStateDriver.detectChanges();
    // then
    const tabElementSpies: DebugElement[] = componentUnderTestSpy.queryAll(By.css('.mat-tab-label'));
    expect(tabElementSpies.length).toBe(2, 'On aurait dû récupérer les tabs Beginners et Advanced');
    const tabLabelContentElementSpies: DebugElement[] = componentUnderTestSpy.queryAll(By.css('.mat-tab-label-content'));

    const tabBeginnerLabelContentElementSpy: DebugElement = tabLabelContentElementSpies[0];
    const tabBeginnerLabelContentElement: Element = tabBeginnerLabelContentElementSpy.nativeElement;
    expect(tabBeginnerLabelContentElement.textContent).toBe('Beginners');

    const tabAdvancedLabelContentElementSpy: DebugElement = tabLabelContentElementSpies[1];
    const tabAdvancedLabelContentElement: Element = tabAdvancedLabelContentElementSpy.nativeElement;
    expect(tabAdvancedLabelContentElement.textContent).toBe('Advanced');
  });

  it('should display advanced courses when advenced tab clicked', (done: DoneFn) => {
    // given
    coursesServiceSpy.findAllCourses.and.returnValue(of(givenAllCourses));
    componentUnderTestStateDriver.detectChanges();
    const tabElementSpies: DebugElement[] = componentUnderTestSpy.queryAll(By.css('.mat-tab-label'));
    expect(tabElementSpies.length).toBe(2, 'On aurait dû récupérer les tabs Beginners et Advanced');
    const tabLabelContentElementSpies: DebugElement[] = componentUnderTestSpy.queryAll(By.css('.mat-tab-label-content'));
    const tabAdvancedLabelContentElementSpy: DebugElement = tabLabelContentElementSpies[1];
    // when
    tabAdvancedLabelContentElementSpy.nativeElement.click();
    componentUnderTestStateDriver.detectChanges();
    // then
    const activeTabLabelElementSpies: DebugElement = componentUnderTestSpy.query(By.css('.mat-tab-label-active'));
    const actualTabAdvancedLabelContentElementSpy: DebugElement = activeTabLabelElementSpies.query(By.css('.mat-tab-label-content'));
    const actualTabAdvancedLabelContentElement: Element = actualTabAdvancedLabelContentElementSpy.nativeElement;
    expect(actualTabAdvancedLabelContentElement.textContent).toBe('Advanced');

    setTimeout(() => { // test de l'affichage asynchrone de la liste des cours advanced
      const cardTitleElementSpies: DebugElement[] = componentUnderTestSpy.queryAll(By.css('.mat-card-title'));
       const firstCardTitleElement: Element = cardTitleElementSpies[0].nativeElement;
      expect(firstCardTitleElement.textContent).toContain('Angular Security Course');
      done();
    }, 500);
  });
});


