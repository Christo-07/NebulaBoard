package com.example.kanban.exception;


import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler extends ResponseEntityExceptionHandler {

  /* ---------- Small helper to build consistent JSON ---------- */
  private Map<String, Object> body(HttpStatusCode status, String message) {
    Map<String,Object> m = new LinkedHashMap<>();
    m.put("timestamp", Instant.now().toString());
    m.put("status", status.value());
    m.put("error", message);
    return m;
  }

  /* ---------- Overrides for common Spring MVC errors ---------- */

  @Override
  protected ResponseEntity<Object> handleHttpRequestMethodNotSupported(
      HttpRequestMethodNotSupportedException ex,
      HttpHeaders headers, HttpStatusCode status, WebRequest request) {
    return ResponseEntity.status(status)
        .contentType(MediaType.APPLICATION_JSON)
        .body(body(status, "Method not allowed: " + ex.getMethod()));
  }

  @Override
  protected ResponseEntity<Object> handleHttpMediaTypeNotSupported(
      HttpMediaTypeNotSupportedException ex,
      HttpHeaders headers, HttpStatusCode status, WebRequest request) {
    return ResponseEntity.status(status)
        .contentType(MediaType.APPLICATION_JSON)
        .body(body(status, "Unsupported media type: " + ex.getContentType()));
  }

  @Override
  protected ResponseEntity<Object> handleHttpMessageNotReadable(
      HttpMessageNotReadableException ex,
      HttpHeaders headers, HttpStatusCode status, WebRequest request) {
    return ResponseEntity.status(status)
        .contentType(MediaType.APPLICATION_JSON)
        .body(body(status, "Malformed request body"));
  }

  @Override
  protected ResponseEntity<Object> handleMethodArgumentNotValid(
      MethodArgumentNotValidException ex,
      HttpHeaders headers, HttpStatusCode status, WebRequest request) {
    Map<String,Object> m = body(status, "Validation failed");
    List<Map<String, String>> errors = ex.getBindingResult().getFieldErrors().stream()
        .map(fe -> Map.of(
            "field", fe.getField(),
            "message", (fe.getDefaultMessage() == null ? "Invalid" : fe.getDefaultMessage())
        ))
        .toList();
    m.put("details", errors);
    return ResponseEntity.status(status).contentType(MediaType.APPLICATION_JSON).body(m);
  }

  /* ---------- Your application-specific handlers ---------- */

  // Invalid username/password → 401
  @ExceptionHandler({ BadCredentialsException.class, AuthenticationException.class, UsernameNotFoundException.class })
  public ResponseEntity<Map<String,Object>> handleAuth(AuthenticationException ex) {
    var status = org.springframework.http.HttpStatus.UNAUTHORIZED;
    return ResponseEntity.status(status)
        .contentType(MediaType.APPLICATION_JSON)
        .body(body(status, (ex.getMessage() == null ? "Unauthorized" : ex.getMessage())));
  }

  // Bad input → 400
  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<Map<String,Object>> handleIllegalArgument(IllegalArgumentException ex) {
    var status = org.springframework.http.HttpStatus.BAD_REQUEST;
    return ResponseEntity.status(status)
        .contentType(MediaType.APPLICATION_JSON)
        .body(body(status, ex.getMessage()));
  }

  // Parameter conversion issues → 400
  @ExceptionHandler(MethodArgumentTypeMismatchException.class)
  public ResponseEntity<Map<String,Object>> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
    var status = org.springframework.http.HttpStatus.BAD_REQUEST;
    return ResponseEntity.status(status)
        .contentType(MediaType.APPLICATION_JSON)
        .body(body(status, "Bad parameter: " + ex.getName()));
  }

 
}
