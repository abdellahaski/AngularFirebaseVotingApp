import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Vote } from '../models/vote.model';
import { DomSanitizer } from '@angular/platform-browser';
import { IpgeolocationService } from './ipgeolocation.service';
import { map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class VotesService {
  private dbPath = '/Votes';
  voteRef: AngularFirestoreCollection<Vote>;

  constructor(private db: AngularFirestore, private sanitizer: DomSanitizer, private ipGeoLocationService: IpgeolocationService) {
    this.voteRef = db.collection(this.dbPath);
  }

  getAll(): AngularFirestoreCollection<Vote> {
    return this.voteRef;
  }
  getVotesCount(): Observable<number> {
    return this.voteRef.snapshotChanges().pipe(map(c => { return c.length }));

  }

  addVote(vote: Vote): void {
    this.voteRef.add({ ...vote });
  }

  vote(candidateID: number): void {
    try {
      this.ipGeoLocationService.getIP().subscribe((IPData: any) => {
        const vote: Vote = {
          candidate: candidateID,
          timestamp: new Date(),
          ip: IPData.ip_address,
          country: IPData.country,
          city: IPData.city
        };
        this.addVote(vote);
      });
    } catch (e) {
      const vote: Vote = {
        candidate: candidateID,
        timestamp: new Date(),
        city: 'unknown',
        country: 'unknown',
        ip: 'unknown'
      };
      this.addVote(vote);
    }
  }
  
}
