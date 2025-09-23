import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  private readonly logger = new Logger(SecurityMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    // Headers de seguridad básicos
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self';"
    );

    // Log de requests sospechosos
    const userAgent = req.get('User-Agent') || '';
    const ip = req.ip || req.connection.remoteAddress;
    
    // Detectar patrones sospechosos
    const suspiciousPatterns = [
      /script/i,
      /javascript/i,
      /vbscript/i,
      /onload/i,
      /onerror/i,
      /<script/i,
      /eval\(/i,
      /union.*select/i,
      /drop.*table/i,
    ];

    const requestData = JSON.stringify(req.body);
    const queryData = JSON.stringify(req.query);
    const urlData = req.url;

    const isSuspicious = suspiciousPatterns.some(pattern => 
      pattern.test(requestData) || 
      pattern.test(queryData) || 
      pattern.test(urlData) ||
      pattern.test(userAgent)
    );

    if (isSuspicious) {
      this.logger.warn(`🚨 Solicitud sospechosa detectada:`, {
        ip,
        userAgent,
        url: req.url,
        method: req.method,
        body: req.body,
        query: req.query,
      });
    }

    // Rate limiting básico por IP (simple implementación)
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minuto
    const maxRequests = 100; // máximo 100 requests por minuto

    if (!global.rateLimitStore) {
      global.rateLimitStore = new Map();
    }

    const clientKey = ip || 'unknown';
    const clientData = global.rateLimitStore.get(clientKey) || { count: 0, resetTime: now + windowMs };

    if (now > clientData.resetTime) {
      clientData.count = 1;
      clientData.resetTime = now + windowMs;
    } else {
      clientData.count++;
    }

    global.rateLimitStore.set(clientKey, clientData);

    if (clientData.count > maxRequests) {
      this.logger.warn(`🚫 Rate limit excedido para IP: ${ip}`);
      return res.status(429).json({
        statusCode: 429,
        message: 'Demasiadas solicitudes. Intenta de nuevo en un minuto.',
        error: 'Too Many Requests'
      });
    }

    // Agregar headers informativos
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - clientData.count));
    res.setHeader('X-RateLimit-Reset', new Date(clientData.resetTime).toISOString());

    next();
  }
}

// Declaración global para TypeScript
declare global {
  var rateLimitStore: Map<string, { count: number; resetTime: number }>;
}
