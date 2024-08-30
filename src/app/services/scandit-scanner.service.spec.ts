import { TestBed } from '@angular/core/testing';

import { ScanditScannerService } from './scandit-scanner.service';

describe('ScanditScannerService', () => {
  let service: ScanditScannerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScanditScannerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
