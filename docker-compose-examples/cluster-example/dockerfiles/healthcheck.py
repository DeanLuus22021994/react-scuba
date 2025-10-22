#!/usr/bin/env python3
"""
Health check script for cluster-example Python service
Tests Python 3.14 features and cluster connectivity
"""

import sys
import socket

def main():
    try:
        # Test Python 3.14 features
        import concurrent.interpreters
        print('Python 3.14 concurrent interpreters OK')

        # Test cluster connectivity (basic check)
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(2)
        s.connect(('postgres', 5432))
        s.close()
        print('PostgreSQL connectivity OK')

        sys.exit(0)
    except Exception as e:
        print(f'Health check failed: {e}')
        sys.exit(1)

if __name__ == '__main__':
    main()
