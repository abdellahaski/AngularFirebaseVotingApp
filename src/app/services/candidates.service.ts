import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Candidate } from '../models/candidate.model';

@Injectable({
  providedIn: 'root'
})
export class CandidatesService {
  private dbPath = '/Candidates';
  candidateRef: AngularFirestoreCollection<Candidate>;

  constructor(private db: AngularFirestore) { 
    this.candidateRef=db.collection(this.dbPath);
  }

  getAll(): AngularFirestoreCollection<Candidate> {
    return this.candidateRef;
  }

  addVote(candidate:Candidate):void{
    this.candidateRef.doc(candidate.candidateID.toString()).update({votes: ++candidate.votes})
  }
}
