import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard, NoUserGuard, SlidesGuard } from './guard/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [NoUserGuard, SlidesGuard]
  },
  {
    path: 'signin',
    loadChildren: () => import('./signin/signin.module').then(m => m.SigninPageModule),
    canActivate: [NoUserGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule),
    canActivate: [NoUserGuard]
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./reset-password/reset-password.module').then(m => m.ResetPasswordPageModule),
    canActivate: [NoUserGuard]
  },
  {
    path: 'landing',
    loadChildren: () => import('./landing/landing.module').then(m => m.LandingPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'enroll',
    loadChildren: () => import('./enroll/enroll.module').then(m => m.EnrollPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'course',
    loadChildren: () => import('./course/course.module').then(m => m.CoursePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'registration',
    loadChildren: () => import('./registration/registration.module').then(m => m.RegistrationPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'payment',
    loadChildren: () => import('./payment/payment.module').then(m => m.PaymentPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'video',
    loadChildren: () => import('./content/video/video.module').then(m => m.VideoPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'documents',
    loadChildren: () => import('./content/documents/documents.module').then(m => m.DocumentsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'news',
    loadChildren: () => import('./content/news/news.module').then(m => m.NewsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'logout',
    loadChildren: () => import('./logout/logout.module').then(m => m.LogoutPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'network-detection',
    loadChildren: () => import('./network-detection/network-detection.module').then(m => m.NetworkDetectionPageModule)
  },
  {
    path: 'enrolledcourses',
    loadChildren: () => import('./enrolledcourses/enrolledcourses.module').then(m => m.EnrolledcoursesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'enrolledcoursesinfo',
    loadChildren: () => import('./enrolledcoursesinfo/enrolledcoursesinfo.module').then(m => m.EnrolledcoursesinfoPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationsPageModule),
    canActivate: [AuthGuard]
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
