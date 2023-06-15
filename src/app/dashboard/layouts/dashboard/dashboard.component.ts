import { Component, OnInit, computed, inject } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { WordService } from '../../services/word.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private authService = inject(AuthService);
  private wordsService = inject(WordService)
  user = computed(()=>this.authService.currentUser())

  ngOnInit(): void {
      this.wordsService.createWord({englishWord: 'hello', translation: 'hola'}).subscribe(data=>console.log(data))
  }

  onLogout() {
    this.authService.logout()
  }

}
