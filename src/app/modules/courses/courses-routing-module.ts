import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CourseList } from "./pages/course-list/course-list";

const routes: Routes = [
  {
    path: "",
    component: CourseList
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule { }