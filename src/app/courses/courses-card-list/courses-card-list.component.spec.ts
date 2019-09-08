import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CoursesCardListComponent} from './courses-card-list.component';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {Course} from '../model/course';
import {setupCourses} from '../common/setup-test-data';


describe('CoursesCardListComponent', () => {

  let componentUnderTest: CoursesCardListComponent;
  let componentUnderTestStateDriver: ComponentFixture<CoursesCardListComponent>;
  let componentUnderTestSpy: DebugElement;

  // given (common setup)
  beforeEach(
    async( // default timeout: 5s
      () => {
        TestBed.configureTestingModule({
          imports: [CoursesModule]
        })
          .compileComponents()
          .then(() => {
            // test setup after component compilation
            componentUnderTestStateDriver = TestBed.createComponent(CoursesCardListComponent);
            componentUnderTest = componentUnderTestStateDriver.componentInstance;
            componentUnderTestSpy = componentUnderTestStateDriver.debugElement;
          });
      }));


  it("should create the component", () => {
    // then
    expect(componentUnderTest).toBeTruthy();
  });


  it("should display the course list", () => {
    // given
    const givenCourses: Course[] = setupCourses();
    componentUnderTest.courses = givenCourses;
    // when
    componentUnderTestStateDriver.detectChanges();
    // then
    const cardElementSpies: DebugElement[] = componentUnderTestSpy.queryAll(By.css(".course-card"));
    expect(cardElementSpies).toBeTruthy("Could not find cards");
    expect(cardElementSpies.length).toBe(givenCourses.length, "unexpected number of courses");
  });


  it("should display the first course", () => {
    // given
    const givenCourses: Course[] = setupCourses();
    componentUnderTest.courses = givenCourses;
    const givenCourse = givenCourses[0];

    // when
    componentUnderTestStateDriver.detectChanges();

    // then
    const cardElementSpy: DebugElement = componentUnderTestSpy.query(By.css(".course-card:first-child"));
    expect(cardElementSpy).toBeTruthy("Could not find the first course card");

    const titleElementSpy: DebugElement = cardElementSpy.query(By.css("mat-card-title"));
    expect(titleElementSpy).toBeTruthy("Could not find the first course card's title");
    const actualTitleElement: Element = titleElementSpy.nativeElement;
    expect(actualTitleElement.textContent).toBe(givenCourse.titles.description);

    const imageElementSpy: DebugElement = cardElementSpy.query(By.css("img"));
    expect(imageElementSpy).toBeTruthy("Could not find the first course card's image");
    const actualImageElement: any = imageElementSpy.nativeElement;
    expect(actualImageElement.src).toBe(givenCourse.iconUrl);
  });

});


